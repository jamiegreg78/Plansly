import { supabase } from '@/backend/Authentication'
import type { ColorPickerOptions } from '@/types/ColorPicker'
import type { Board, Module } from '@/types/DatabaseTypes'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// TODO: Create types for this data
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
	
	// Search for the correct Module, then return the index for later use
	function getBoardIndex(id: number): number {
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
				const tempArray = []
				tempArray.push(data)
				userData.value[currentModuleIndex].boards = tempArray as unknown as Array<Board>
			}
		}
		
	}

	return { hasInitialised, userData, getAllData, createNewModule, createNewBoardForModule, getBoardIndex }
})
