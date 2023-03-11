import { supabase } from '@/backend/Authentication'
import type { Board, List, Task } from '@/types/DatabaseTypes'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useCurrentBoardStore = defineStore('currentBoardState', () => {
	const router = useRouter()

	// state
	const currentBoard = ref<Board>() // Contains the board currently being viewed
	const currentTaskOverview = ref()// contains the task thats visible within the overview 
	
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

	return { currentBoard, loadCurrentBoard, createNewList, createNewCard }
})