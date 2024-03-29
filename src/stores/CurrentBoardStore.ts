import { supabase } from '@/backend/Authentication'
import type { Board, List, UpdatedListInformation, Task, UpdatedTaskInformation, UpdatedBoardInformation, Dependency } from '@/types/DatabaseTypes'
import { sortArrayByKey } from '@/utils/UtilityFunctions'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserDataStore } from './UserDataStore'
export type FilterType = 'by_created' | 'by_due_date' | 'by_start_date' | ''

// This store contains the global state for the board currently being viewed.
export const useCurrentBoardStore = defineStore('currentBoardState', () => {
	const router = useRouter()
	const userData = useUserDataStore()

	// state
	const currentBoard = ref<Board>() // Contains the board currently being viewed
	const currentTaskOverview = ref<Task | undefined>()// contains the task thats visible within the overview 
	const currentListOverview = ref<List | undefined>()// Contains the list thats visible within the overview
	const searchResults = ref<Task[]>([]) // Contains the results of the search
	const filter = ref<FilterType>('')
	const filteredBoard = computed(() => { 
		const board: Board = JSON.parse(JSON.stringify(currentBoard.value))
		if (filter.value === 'by_created') {
			board.lists.forEach((list: List) => { 
				if (list.tasks !== undefined) {
					list.tasks = sortArrayByKey(list.tasks, 'created_at') as Task[] 
				}
			})
			return board
		} else if (filter.value === 'by_due_date') {
			board.lists.forEach((list: List) => { 
				if (list.tasks !== undefined) {
					list.tasks = sortArrayByKey(list.tasks, 'expected_finish_date') as Task[] 
				}
			})
			return board
		} else if (filter.value === 'by_start_date') {
			board.lists.forEach((list: List) => { 
				if (list.tasks !== undefined) {
					list.tasks = sortArrayByKey(list.tasks, 'expected_start_date') as Task[] 
				}
			})
			return board
		} else {
			return null
		}
	})

	// Loads the board from the database
	async function loadCurrentBoard() {
		const { data, error } = await supabase
			.from('boards')
			.select(`
				*,
				lists (
					*,
					tasks (
						*,
						blocking:blocking_dependencies!blocking_dependencies_blocking_task_fkey (*, information:tasks!blocking_dependencies_blocked_task_fkey (id, name, description, list)),
						blocked:blocking_dependencies!blocking_dependencies_blocked_task_fkey (*, information:tasks!blocking_dependencies_blocking_task_fkey (id, name, description, list))
					)
				)
			`)
			.eq('id', router.currentRoute.value.params.boardId)
			.returns<Board[]>()

		if (error) {
			console.error(error)
		} else {
			if (data.length !== 0) {
				// create a copy of the data so I can set the type
				const obtainedBoard: Board = data[0]

				obtainedBoard.lists.sort((a, b) => {
					if (a.order < b.order) {
						return -1
					} else if (a.order > b.order) {
						return 1
					} 

					return 0
				})
				
				obtainedBoard.lists.forEach(list => {
					if (list.tasks !== undefined) {
						list.tasks.sort((a, b) => {
							if (a.order < b.order) {
								return -1
							} else if (a.order > b.order) {
								return 1
							} 
							return 0
						})
					}
				})

				currentBoard.value = data[0] as Board
			}
			return { data, error }
		}
	}
	
	// Creates a new list within the board, with the correct order value
	async function createNewList(name: string) {
		const { data, error } = await supabase
			.from('lists')
			.insert([
				{
					name: name,
					board: currentBoard.value?.id,
					order: currentBoard.value!.lists.length + 1
				}
			]).select('*, tasks(*)')
			.returns<List[]>()
		if (error) {
			console.error(error)
		} else {
			currentBoard.value?.lists.push(data[0])
		}
	}

	// Creates a new task card within the list, with the correct order value
	async function createNewCard(name: string, listIndex: number) {
		if (currentBoard.value !== undefined) {
			const listId = currentBoard.value?.lists[listIndex].id
			const newCardOrder = currentBoard.value?.lists[listIndex].tasks?.length || 0

			const { data, error } = await supabase
				.from('tasks')
				.insert([
					{
						name: name,
						list: listId,
						order: newCardOrder + 1
					}
				]).select(
					`*, 
						blocking:blocking_dependencies!blocking_dependencies_blocking_task_fkey (*, information:tasks!blocking_dependencies_blocked_task_fkey (id, name, description, list)),
						blocked:blocking_dependencies!blocking_dependencies_blocked_task_fkey (*, information:tasks!blocking_dependencies_blocking_task_fkey (id, name, description, list))
					`
				)
				.returns<Task[]>()
			if (error) {
				console.error(error)
			} else {
				currentBoard.value?.lists[listIndex].tasks?.push(data[0])
			}

		}
	}

	// Sets the current task overview to the task provided. This will typically open the task overview
	function setCurrentTaskOverview(task: Task | undefined) {
		currentTaskOverview.value = task
	}
	
	// Sets the current list overview to the list provided. This will typically open the list overview
	function setCurrentListOverview(list: List | undefined) {
		currentListOverview.value = list
	}
	
	// Sets the data within the board such as name, description, etc.
	async function changeBoardDetails(newDetails: UpdatedBoardInformation) {
		const copiedBoard = JSON.parse(JSON.stringify(currentBoard.value))
		delete copiedBoard.lists

		const { data, error } = await supabase
			.from('boards')
			.update({...copiedBoard, ...newDetails})
			.eq('id', copiedBoard.id)
			.select(`*, lists(*, tasks(*))`)
			.returns<Board[]>()
			
		if (error) {
			console.error(error)
		} else {
			currentBoard.value = data[0]
			userData.replaceBoard(data[0].module, data[0])
		}
	}

	// Sets the data within the list such as name, description, etc.
	async function changeListDetails(newDetails: UpdatedListInformation) {
		const listIndex: number | undefined = currentBoard.value?.lists.indexOf(currentListOverview.value!)
		const copiedList: List = JSON.parse(JSON.stringify(currentListOverview.value))

		if (typeof listIndex !== 'undefined') {
			const { data, error } = await supabase
				.from('lists')
				.upsert({...newDetails, id: copiedList.id, board: copiedList.board, order: copiedList.order})
				.eq('id', currentListOverview.value!.id)
				.select(`
					*,
					tasks(
						*,
						blocking:blocking_dependencies!blocking_dependencies_blocking_task_fkey (*, information:tasks!blocking_dependencies_blocked_task_fkey (id, name, description, list)),
						blocked:blocking_dependencies!blocking_dependencies_blocked_task_fkey (*, information:tasks!blocking_dependencies_blocking_task_fkey (id, name, description, list))
					)
				`)
				.returns<List[]>()
		
			if (error) {
				console.error(error)
			} else {
				if (currentBoard.value) {
					currentBoard.value.lists[listIndex] = data[0]
				}
			}
		}
	}
	
	// Deletes all provided dependencies from the database
	async function deleteDependencies(deletedDependencies: Dependency[]) {
		const deletedDependencyIds = deletedDependencies.map((dependency: Dependency) => dependency.id)
		const { data, error } = await supabase
			.from('blocking_dependencies')
			.delete()
			.in('id', deletedDependencyIds)
		if (error) {
			console.error(error)
		} else {
			// Delete the dependencies from the task at the other end of the dependency
			deletedDependencies.forEach((dependency: Dependency) => {
				const listIndex: number | undefined = currentBoard.value?.lists.findIndex(x => x.id === dependency.information?.list)
				const taskIndex = listIndex !== undefined ? currentBoard.value?.lists[listIndex].tasks?.findIndex(x => x.id === dependency.information?.id) : undefined
				
				if (taskIndex !== undefined) {
					const task: Task | undefined = currentBoard.value?.lists[listIndex!].tasks?.[taskIndex]
					const blockingOrBlocked: 'blocking' | 'blocked' = 
						task !== undefined && dependency.blocking_task === task.id ? 'blocking' : 'blocked' 
					
					// Delete the dependency from the appropriate array
					if (task !== undefined && blockingOrBlocked === 'blocking') {
						task.blocking.splice(task.blocking.findIndex(x => x.id === dependency.id), 1)
					} else if (task !== undefined && blockingOrBlocked === 'blocked') {
						//task.blocked = task.blocked?.filter(x => x.id !== dependency.id)
						task.blocked.splice(task.blocked.findIndex(x => x.id === dependency.id), 1)
					}
				}
			})
		}
	}
	
	// Adds all provided dependencies to the database
	async function addDependencies(newDependencies: Dependency[]) {
		// clone dependencies then remove the information object
		const dependencies = JSON.parse(JSON.stringify(newDependencies))
		dependencies.forEach((dependency: Dependency) => {
			delete dependency.information
			delete dependency.created_at
			delete dependency.user_id
			if (dependency.id === undefined) {
				// This value is replaced by the database using a trigger function
				dependency.id = null
			}
		})

		const { data, error } = await supabase
			.from('blocking_dependencies')
			.upsert([...dependencies], { onConflict: 'id', ignoreDuplicates: false})
		if (error) {
			console.error(error)
		}
	}
	
	// Repairs any missing pairings between tasks that are blocking/blocked by each other
	// TODO: If I get the time, this should be altered such that the function isn't defined inside the function. 
	// This has a negative impact on performance due to the function being redefined every time the function is called
	function repairDependencyPairings(task: Task) {
		function tempFunction(array: Dependency[], mode: 'blocking' | 'blocked') {
			// For each blocking dependency
			array.forEach((dependency) => {
				// Find the paired task
				const taskList: List | undefined = currentBoard.value?.lists.find(list => list.id === dependency.information?.list)
				const pairedTask: Task | undefined = taskList?.tasks?.find(task => task.id === dependency.information?.id)
				if (pairedTask) {
					// Check to see if the dependency is already in the correct array (opposite)
					const foundCurrentDependency: Dependency | undefined = pairedTask[mode === 'blocking' ? 'blocking' : 'blocked'].find(foundDependency => foundDependency.id === dependency.id)
					
					// If the dependency is already there, check for changes and update if necessary, otherwise add it
					if (foundCurrentDependency !== undefined) {
						const foundCurrentDependencyIndex: number | undefined = pairedTask[mode === 'blocking' ? 'blocking' : 'blocked'].indexOf(foundCurrentDependency)
						const hasChanged = (foundCurrentDependency.blocking_task !== dependency.blocking_task && foundCurrentDependency.blocked_task !== dependency.blocked_task)
						if (hasChanged) {
							// Remove it from the current array and place it in the opposite
							pairedTask[mode === 'blocking' ? 'blocking' : 'blocked'].splice(foundCurrentDependencyIndex, 1)
							pairedTask[mode === 'blocking' ? 'blocked' : 'blocking'].push({
								...dependency,
								information: {
									id: task.id,
									name: task.name,
									description: task.description,
									list: task.list,
								}
							})
						}
					} else {
						const alreadyInPlace = pairedTask[mode === 'blocking' ? 'blocked' : 'blocking'].find(foundDependency => foundDependency.id === dependency.id) !== undefined
						if (!alreadyInPlace) {
							const copiedArray = [...pairedTask[mode === 'blocking' ? 'blocking' : 'blocked']]

							copiedArray.push({
								...dependency,
								information: {
									id: task.id,
									name: task.name,
									description: task.description,
									list: task.list,
								}
							})

							pairedTask[mode === 'blocking' ? 'blocked' : 'blocking'] = copiedArray
						}
					}
				}
			})
		}
		tempFunction(task.blocking, 'blocking')
		tempFunction(task.blocked, 'blocked')
	}
	
	// Updates the task details and dependencies in the database
	async function changeTaskDetails(newDetails: UpdatedTaskInformation, newDependencies?: Dependency[], deletedDependencies?: Dependency[]) {
		const listIndex: number | undefined = currentBoard.value?.lists.findIndex(x => x.id === currentTaskOverview.value?.list)
		const copiedTask: any = JSON.parse(JSON.stringify(currentTaskOverview.value)) // Casted to any since I'm removing the blocking and blocked properties - it will be reassigned later
		
		if (deletedDependencies !== undefined && deletedDependencies.length) {
			await deleteDependencies(deletedDependencies)
		}

		if (newDependencies !== undefined && newDependencies.length) {
			await addDependencies(newDependencies)
		}

		if (listIndex !== undefined) {
			const taskIndex: number | undefined = currentBoard.value?.lists[listIndex].tasks?.findIndex(x => x.id === currentTaskOverview.value?.id)
			delete copiedTask.blocking
			delete copiedTask.blocked

			const { data, error } = await supabase
				.from('tasks')
				.upsert({...copiedTask, ...newDetails})
				.select(`*, 
						blocking:blocking_dependencies!blocking_dependencies_blocking_task_fkey (*, information:tasks!blocking_dependencies_blocked_task_fkey (id, name, description, list)),
						blocked:blocking_dependencies!blocking_dependencies_blocked_task_fkey (*, information:tasks!blocking_dependencies_blocking_task_fkey (id, name, description, list))
				`)
				.returns<Task[]>()

			if (error) {
				console.error(error)
			} else {
				if (currentBoard.value && taskIndex !== undefined) {
					currentBoard.value.lists[listIndex].tasks![taskIndex] = data[0]

					repairDependencyPairings(data[0] as Task)
				}
			}
		}
	}
	
	// toggles the completed status of a task
	async function toggleTaskCompleted(task: Task) {
		const { data, error } = await supabase
			.from('tasks')
			.update({completed: !task.completed})
			.eq('id', task.id)
			.select()
			.returns<Task[]>()

		if (error) {
			console.error(error)
		} else {
			currentBoard.value?.lists.forEach((list) => {
				if (list.id === task.list) {
					list.tasks?.forEach((foundTask) => {
						if (foundTask.id === task.id) {
							foundTask.completed = data[0].completed
						}
					})
				}
			})
		}
		return { data, error }
	}
	
	// Deletes a List from the database
	async function deleteList(list: List) {
		let listIndex
		currentBoard.value?.lists.forEach((foundList, index) => {
			if (foundList.id === list.id) {
				listIndex = index
			}
		})

		if (typeof listIndex !== 'undefined') {
			currentBoard.value?.lists.splice(listIndex, 1)
		}
		
		// Fix order values
		currentBoard.value!.lists = fixOrderValues(currentBoard.value!.lists) as Array<List>

		const tempArray: Array<any> = JSON.parse(JSON.stringify(currentBoard.value?.lists))
		tempArray?.forEach(list => {
			delete list.tasks
		})

		await supabase
			.from('lists')
			.upsert([...tempArray])

		await supabase
			.from('tasks')
			.delete()
			.eq('list', list.id)
		
		await supabase
			.from('lists')
			.delete()
			.eq('id', list.id)
		
	}
	
	// Deletes a Task from the database
	async function deleteTask(task: Task) {
		// Find the list
		let listIndex
		currentBoard.value?.lists.forEach((foundList, index) => {
			if (foundList.id === task.list) {
				listIndex = index
			}
		})
		// Create a copy of the list
		let newList
		if (typeof listIndex !== 'undefined') {
			newList = currentBoard.value?.lists[listIndex].tasks?.slice()
		}

		// Remove the item from the array
		newList?.splice(newList.indexOf(task), 1)

		// Fix the ordering
		if (typeof newList !== 'undefined') {
			newList = fixOrderValues(newList)
		}

		// Commit the results to state
		if (typeof listIndex !== 'undefined' && typeof newList !== 'undefined') {
			currentBoard.value!.lists[listIndex].tasks = newList as Array<Task>
		}

		await supabase
			.from('tasks')
			.upsert([...newList!])
			
		await supabase
			.from('tasks')
			.delete()
			.eq('id', task.id)
	}
	
	// Moves the card within the same list
	async function moveCardWithinSameList(listIndex: number, oldIndex: number, newIndex: number) {
		// create a copy of the moved task first
		const task: Task = {...currentBoard.value!.lists[listIndex].tasks?.[oldIndex]!}

		// remove the original copy of the task first. Do all mutation on a duplicate array to maintain reactivity
		let newList = [...currentBoard.value?.lists[listIndex].tasks!]

		if (task !== undefined && newList !== undefined) {
			newList.splice(oldIndex, 1)
		
			// add the item back in, at the desired index
			newList.splice(newIndex, 0, task)
			// correct the order values
			newList = fixOrderValues(newList) as Array<Task>
		
			const { data, error } = await supabase
				.from('tasks')
				.upsert(newList.map(({blocking, blocked, ...rest}) => rest))
				.select(`*, 
						blocking:blocking_dependencies!blocking_dependencies_blocking_task_fkey (*, information:tasks!blocking_dependencies_blocked_task_fkey (id, name, description, list)),
						blocked:blocking_dependencies!blocking_dependencies_blocked_task_fkey (*, information:tasks!blocking_dependencies_blocking_task_fkey (id, name, description, list))
				`)
				.order('order')
				.returns<Task[]>()
		
			if (error) {
				console.error(error)
			} else {
				currentBoard.value!.lists[listIndex].tasks = data
			}
		}
	}
	
	// Moves the card between lists
	async function moveCardsBetweenLists(oldListIndex: number, newListIndex: number, oldIndex: number, newIndex: number) {
		// create a copy of the moved task first
		const task: Task = {...currentBoard.value!.lists[oldListIndex].tasks?.[oldIndex]!}
		// Set the new list id of the task
		task.list = currentBoard.value!.lists[newListIndex].id

		// create a temp copy of the original list
		let tempOldList: Array<Task> | undefined = currentBoard.value!.lists[oldListIndex].tasks?.slice()

		// Remove the task from the original list first
		tempOldList?.splice(oldIndex, 1)

		// Create a temp copy of the destination list
		let tempNewList: Array<Task> | undefined = currentBoard.value!.lists[newListIndex].tasks?.slice()
		
		// Add the item to the list at the new index
		tempNewList?.splice(newIndex, 0, task)

		if (tempOldList !== undefined && tempNewList !== undefined) {
		// fix the order values
			tempOldList = fixOrderValues(tempOldList) as Array<Task>
			tempNewList = fixOrderValues(tempNewList) as Array<Task>
		
			currentBoard.value!.lists[oldListIndex].tasks = tempOldList.slice()
			currentBoard.value!.lists[newListIndex].tasks = tempNewList.slice()

			const {data, error} = await supabase
				.from('tasks')
				.upsert([
						...tempOldList.map(({blocking, blocked, ...rest}) => rest),
						...tempNewList.map(({blocking, blocked, ...rest}) => rest)
					])
				.select(`*, 
						blocking:blocking_dependencies!blocking_dependencies_blocking_task_fkey (*, information:tasks!blocking_dependencies_blocked_task_fkey (id, name, description, list)),
						blocked:blocking_dependencies!blocking_dependencies_blocked_task_fkey (*, information:tasks!blocking_dependencies_blocking_task_fkey (id, name, description, list))
				`)
				.order('order').returns<Task[]>()

			if (error) {
				console.error(error)
			} else {
			
				// Repair any broken list ids in tasks blocked by this one
				task.blocking?.forEach(dependency => {
					const foundTask = currentBoard.value?.lists
						.find(list => list.id === dependency.information?.list)
						?.tasks?.find(task => task.id === dependency.information?.id)

					foundTask?.blocked.forEach(blockedTask => {
						if (task?.id === blockedTask.information?.id) {
							blockedTask.information.list = task.list
						}
					})
				})

				// Do the same thing, but for the tasks blocking this one
				task.blocked?.forEach(dependency => {
					const foundTask = currentBoard.value?.lists
						.find(list => list.id === dependency.information?.list)
						?.tasks?.find(task => task.id === dependency.information?.id)
					
					foundTask?.blocking.forEach(blockingTask => {
						if (task?.id === blockingTask.information?.id) {
							blockingTask.information.list = task.list
						}
					})
				})
			}
		}
	}
	
	// Moves the list
	async function moveList(oldIndex: number, newIndex: number) {
		// If the list is being moved to the same index, do nothing
		if (oldIndex === newIndex) {
			return
		}

		// Create a copy of the array
		const list: List = JSON.parse(JSON.stringify(currentBoard.value!.lists[oldIndex]))
		
		// Remove the original list
		let newListArray: Array<any> = [...currentBoard.value!.lists]
		newListArray.splice(oldIndex, 1)

		// add the list back in at the new index
		newListArray.splice(newIndex, 0, list)
		
		// Fix the order
		newListArray = fixOrderValues(newListArray) as Array<List>
		if (currentBoard.value !== undefined) {
			currentBoard.value.lists = JSON.parse(JSON.stringify(newListArray))
		}
		
		// remove the tasks array from the list
		const upsertableArray = newListArray.map((item: List) => {
			delete item.tasks
			return item
		})
		
		const { data, error } = await supabase
			.from('lists')
			.upsert([...upsertableArray])
			.select(`
				*,
				tasks(*, 
						blocking:blocking_dependencies!blocking_dependencies_blocking_task_fkey (*, information:tasks!blocking_dependencies_blocked_task_fkey (id, name, description, list)),
						blocked:blocking_dependencies!blocking_dependencies_blocked_task_fkey (*, information:tasks!blocking_dependencies_blocking_task_fkey (id, name, description, list))
					)
			`)
			.order('order')

		if (error) {
			console.error(error)
		}
	}

	// Repairs the order values, ensures no gaps
	function fixOrderValues(taskArray: Array<Task | List>): Array<Task | List> {
		const tempArray: Array<Task | List> = taskArray.slice()
		for (let i = 0; i < tempArray.length; i++) {
			tempArray[i].order = i + 1
		}
		return tempArray
	}

	function setSearchResults(results: Array<Task>) {
		searchResults.value = results
	}

	return { 
		currentBoard,
		currentTaskOverview, 
		searchResults,
		setSearchResults,
		setCurrentListOverview,
		currentListOverview, 
		deleteTask,
		deleteList,
		toggleTaskCompleted,
		setCurrentTaskOverview,
		loadCurrentBoard,
		createNewList,
		createNewCard,
		moveCardWithinSameList,
		moveCardsBetweenLists,
		changeListDetails,
		changeTaskDetails,
		changeBoardDetails,
		moveList,
		filter,
		filteredBoard
	}
})