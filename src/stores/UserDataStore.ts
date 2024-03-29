import { supabase } from '@/backend/Authentication'
import type { ColorPickerOptions } from '@/types/ColorPicker'
import type { Board, Module, Task } from '@/types/DatabaseTypes'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// This store contains the global state for the user. It is used to store the modules and boards that the user has created.
export const useUserDataStore = defineStore('userDataState', () => {
	const hasInitialised = ref<boolean>(false)
	const userData = ref<Array<Module>>([])
	
	// Get all modules & boards for the current user. Contents of boards will be loaded when needed.
	async function getAllData() {
		const { data: modules, error } = await supabase
			.from('modules')
			.select(`
    id,
		name,
		description,
		created_at,
		edited_at,
		user_id,
    boards (
      id,
			created_at,
			edited_at,
			user_id,
			name,
			description,
			module,
			color
    )
  `)
			
		if (error) {
			console.error(error)
		} else {
			hasInitialised.value = true
			userData.value = modules as Array<Module>
		}
	}
	
	// Creates a new module and adds it to the userData array
	async function createNewModule(title: string, description: string) {
		const { data, error } = await supabase
			.from('modules')
			.insert([
				{
					name: title,
					description: description,
				}
			]).select()

		if (error) {
			console.error(error)
		} else {
			const tempArray: Array<Module> = userData.value.slice()
			tempArray.push(data[0] as Module)
			userData.value = tempArray
		}
	}
	
	// Search for the correct board by and return it 
	// No backend interaction
	function getBoardById(moduleId: number, boardId: number): Board | null {
		let foundBoard = null

		userData.value.forEach(module => {
			if (module.id === moduleId) {
				module.boards.forEach(board => {
					if (board.id === boardId) {
						foundBoard = board
						return foundBoard
					}
				})
			}
		})

		return foundBoard
	}
	
	// Replaces the board with the same id as the one passed in
	function replaceBoard(moduleId: number, board: Board) {
		let moduleIndex = userData.value.findIndex(module => module.id === moduleId)
		let boardIndex = userData.value[moduleIndex].boards.findIndex(item => item.id === board.id)
		userData.value[moduleIndex].boards[boardIndex] = board
	}

	// Search for the correct Module, then return the index for later use
	function getModuleIndex(id: number): number {
		let foundIndex: number = -1
		if (userData.value.length) {
			userData.value.forEach((item, index) => {
				if (item.id === id) {
					foundIndex = index
				}
			})
		}

		return foundIndex
	} 
	
	// Creates a new board and adds it to the correct module
	async function createNewBoardForModule(name: string, description: string, color: ColorPickerOptions | null, currentModuleIndex: number) {
		const { data, error } = await supabase
			.from('boards')
			.insert([
				{
					name: name,
					description: description,
					module: userData.value[currentModuleIndex].id,
					color: color,
				}
			]).select()
		if (error) {
			console.error(error)
		} else {
			// if the boards array exists, add the new board to it. Otherwise, create a new array and add it instead.
			if (userData.value[currentModuleIndex].boards) {
				userData.value[currentModuleIndex].boards.push(data[0] as Board)
			} else {
				const tempArray = data.slice()
				userData.value[currentModuleIndex].boards = tempArray as Array<Board>
			}
		}
	}

	async function deleteModule(id: number) {
		const { data, error } = await supabase
			.from('modules')
			.delete()
			.eq('id', id)
		if (error) {
			console.error(error)
		} else {
			userData.value = userData.value.filter(item => item.id !== id)
		}
	}

	async function deleteBoard(moduleId: number, boardId: number) {
		const { data, error } = await supabase
			.from('boards')
			.delete()
			.eq('id', boardId)
		if (error) {
			console.error(error)
		} else {
			let moduleIndex = userData.value.findIndex(module => module.id === moduleId)
			userData.value[moduleIndex].boards = userData.value[moduleIndex].boards.filter(item => item.id !== boardId)
		}
	}


	return { hasInitialised, userData, getAllData, createNewModule, createNewBoardForModule, getModuleIndex, getBoardById, replaceBoard, deleteModule, deleteBoard }
})
