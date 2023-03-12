import { supabase } from '@/backend/Authentication'
import type { Board, List, Task } from '@/types/DatabaseTypes'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useCurrentBoardStore = defineStore('currentBoardState', () => {
	const router = useRouter()

	// state
	const currentBoard = ref<Board>() // Contains the board currently being viewed
	const currentTaskOverview = ref<Task | undefined>()// contains the task thats visible within the overview 
	
	async function loadCurrentBoard() {
		const { data, error } = await supabase
			.from('boards')
			.select(`
				*,
				lists (
					*,
					tasks (
						*
					)
				)
			`).eq('id', router.currentRoute.value.params.boardId)

		if (error) {
			console.error(error)
			// TODO: redirect to 404
		} else {
			currentBoard.value = data[0] as Board
		}
	}
	
	async function createNewList(name: string) {
		const { data, error } = await supabase
			.from('lists')
			.insert([
				{
					name: name,
					board: currentBoard.value?.id
				}
			]).select('*, tasks(*)')
		
		if (error) {
			console.error(error)
		} else {
			currentBoard.value?.lists.push(data[0] as List)
		}
	}

	async function createNewCard(name: string, listId: number) {
		const { data, error } = await supabase
			.from('tasks')
			.insert([
				{
					name: name,
					list: listId
				}
			]).select()

		if (error) {
			console.error(error)
		} else {
			currentBoard.value?.lists[getListIndex(listId)].tasks.push(data[0] as Task)
		}
	}
	
	// Get the index of the desired list using the ID
	function getListIndex(id: number): number {
		let foundListIndex = -1
		currentBoard.value?.lists.forEach((list, index) => {
			if (list.id === id) {
				foundListIndex = index
			}
		})
		return foundListIndex
	}

	function setCurrentTaskOverview(task: Task | undefined) {
		currentTaskOverview.value = task
	}
	
	async function changeTaskName(name: string) {
		const { data, error } = await supabase
			.from('tasks')
			.update({name: name})
			.eq('id', currentTaskOverview.value?.id)
			.select()
			
		if (error) {
			console.error(error)
		} else {
			currentTaskOverview.value!.name = (data[0] as Task).name
		}
	}
	
	async function changeTaskDescription(description: string) {
		const { data, error } = await supabase
			.from('tasks')
			.update({description: description})
			.eq('id', currentTaskOverview.value?.id)
			.select()

		if (error) {
			console.error(error)
		} else {
			currentTaskOverview.value!.description = (data[0] as Task).description
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
			currentBoard.value?.lists.forEach((list, listIndex) => {
				if (list.id === task.list) {
					list.tasks.forEach((foundTask, taskIndex) => {
						if (foundTask.id === task.id) {
							foundTask.completed = (data[0] as Task).completed
						}
					})
				}
			})
		}
	}
	
	async function deleteTask(task: Task) {
		const { data, error } = await supabase
			.from('tasks')
			.delete()
			.eq('id', currentTaskOverview.value!.id)
			
		if (error) {
			console.error(error)
		} else {
			let listIndex
			currentBoard.value?.lists.forEach((foundList, foundListIndex) => {
				if (foundList.id === task.list) {
					listIndex = foundListIndex
				}
			})
			
			if (typeof listIndex !== 'undefined') {
				const taskIndex = currentBoard.value!.lists[listIndex].tasks.indexOf(task)
				currentBoard.value!.lists[listIndex].tasks.splice(taskIndex, 1)
			}
		}
	}

	return { currentBoard, currentTaskOverview, deleteTask,changeTaskName, changeTaskDescription, toggleTaskCompleted, setCurrentTaskOverview, loadCurrentBoard, createNewList, createNewCard }
})