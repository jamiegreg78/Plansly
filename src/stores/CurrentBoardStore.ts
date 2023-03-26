import { supabase } from '@/backend/Authentication'
import type { Board, List, UpdatedListInformation, Task, UpdatedTaskInformation } from '@/types/DatabaseTypes'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useCurrentBoardStore = defineStore('currentBoardState', () => {
	const router = useRouter()

	// state
	const currentBoard = ref<Board>() // Contains the board currently being viewed
	const currentTaskOverview = ref<Task | undefined>()// contains the task thats visible within the overview 
	const currentListOverview = ref<List | undefined>()// Contains the list thats visible within the overview
	
	async function loadCurrentBoard() {
		const { data, error }= await supabase
			.from('boards')
			.select(`
				*,
				lists (
					*,
					tasks (
						*
					)
				)
			`)
			.eq('id', router.currentRoute.value.params.boardId)

		if (error) {
			console.error(error)
			// TODO: redirect to 404
		} else {
			// create a copy of the data so I can set the type
			const obtainedBoard: Board = data[0] as Board

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
	}
	
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
		
		if (error) {
			console.error(error)
		} else {
			currentBoard.value?.lists.push(data[0] as List)
		}
	}

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
				]).select()

			if (error) {
				console.error(error)
			} else {
				currentBoard.value?.lists[listIndex].tasks?.push(data[0] as Task)
			}

		}
	}

	function setCurrentTaskOverview(task: Task | undefined) {
		currentTaskOverview.value = task
	}
	
	function setCurrentListOverview(list: List | undefined) {
		currentListOverview.value = list
	}
	
	async function changeListDetails(newDetails: UpdatedListInformation) {
		const listIndex: number | undefined = currentBoard.value?.lists.indexOf(currentListOverview.value!)
		const copiedList: List = JSON.parse(JSON.stringify(currentListOverview.value))
		delete copiedList.tasks

		if (typeof listIndex !== 'undefined') {
			const { data, error } = await supabase
				.from('lists')
				.upsert({...copiedList, ...newDetails})
				.eq('id', currentListOverview.value!.id)
				.select('*, tasks(*)')
		
			if (error) {
				console.error(error)
			} else {
				if (currentBoard.value) {
					currentBoard.value.lists[listIndex] = data[0] as List
				}
			}
		}
	}
	
	async function changeTaskDetails(newDetails: UpdatedTaskInformation) {
		const listIndex: number | undefined = currentBoard.value?.lists.findIndex(x => x.id === currentTaskOverview.value?.list)
		const copiedTask: Task = JSON.parse(JSON.stringify(currentTaskOverview.value))
		
		if (listIndex !== undefined) {
			const taskIndex: number | undefined = currentBoard.value?.lists[listIndex].tasks?.findIndex(x => x.id === currentTaskOverview.value?.id)

			const { data, error } = await supabase
				.from('tasks')
				.upsert({...copiedTask, ...newDetails})
				.select()

			if (error) {
				console.error(error)
			} else {
				if (currentBoard.value && taskIndex !== undefined) {
					currentBoard.value.lists[listIndex].tasks![taskIndex] = data[0] as Task
				}
			}
		}
}

	async function toggleTaskCompleted(task: Task) {
		const { data, error } = await supabase
			.from('tasks')
			.update({completed: !task.completed})
			.eq('id', task.id)
			.select()

		if (error) {
			console.error(error)
		} else {
			currentBoard.value?.lists.forEach((list) => {
				if (list.id === task.list) {
					list.tasks?.forEach((foundTask) => {
						if (foundTask.id === task.id) {
							foundTask.completed = (data[0] as Task).completed
						}
					})
				}
			})
		}
	}
	
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
		const task: Task | undefined = currentBoard.value!.lists[listIndex].tasks?.[oldIndex]

		// remove the original copy of the task first. Do all mutation on a duplicate array to maintain reactivity
		let newList: Array<Task> | undefined = currentBoard.value!.lists[listIndex].tasks?.slice()
		
		if (task !== undefined && newList !== undefined) {
			newList.splice(oldIndex, 1)
		
			// add the item back in, at the desired index
			newList.splice(newIndex, 0, task)
			// correct the order values
			newList = fixOrderValues(newList) as Array<Task>
		
			const { data, error } = await supabase
				.from('tasks')
				.upsert([...newList])
				.select()
				.order('order')
		
			if (error) {
				console.error(error)
			} else {
				currentBoard.value!.lists[listIndex].tasks = data as Array<Task>
			}
		}
	}
	
	async function moveCardsBetweenLists(oldListIndex: number, newListIndex: number, oldIndex: number, newIndex: number) {
		// create a copy of the moved task first
		const task: Task = JSON.parse(JSON.stringify(currentBoard.value!.lists[oldListIndex].tasks?.[oldIndex]))
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

			await supabase
				.from('tasks')
				.upsert([...tempOldList, ...tempNewList])
				.select()
				.order('order')
		}
	}
	
	async function moveList(oldIndex: number, newIndex: number) {
		if (oldIndex === newIndex) {
			return // do nothing
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
		
		// remove the tasks array from the list
		const upsertableArray: Array<any> = JSON.parse(JSON.stringify(newListArray))
		upsertableArray.forEach(list => {
			delete list.tasks
		})
		
		const { data, error } = await supabase
			.from('lists')
			.upsert([...upsertableArray])
			.select('*, tasks(*)')
			.order('order')

		if (error) {
			console.error(error)
		} else {
			(data as List[]).forEach((list: List) => {
				list.tasks = list.tasks?.sort((a: Task, b: Task) => a.order - b.order)
			})
			currentBoard.value!.lists = data as Array<List>
		}
	}

	function fixOrderValues(taskArray: Array<Task | List>): Array<Task | List> {
		const tempArray: Array<Task | List> = taskArray.slice()
		for (let i = 0; i < tempArray.length; i++) {
			tempArray[i].order = i + 1
		}
		return tempArray
	}

	return { 
		currentBoard,
		currentTaskOverview, 
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
		moveList
	}
})