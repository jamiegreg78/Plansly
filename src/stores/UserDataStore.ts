import { supabase } from '@/backend/Authentication'
import { GetUserData } from '@/backend/UserData'
import type { Module } from '@/types/Module'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// TODO: Create types for this data
export const useUserDataStore = defineStore('userDataState', () => {
	const isSubscribed = ref<boolean>(false)
	const userData = ref<Array<Module>>([])
	
	function subscribeToModules() {
		isSubscribed.value = true
		console.log('subscribed')
		const modules = supabase.channel('custom-all-channel')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'modules' },
				(payload) => {
					console.log('Change received!', payload)
					userData.value.push(payload.new as Module)
				}
			)
			.subscribe(status => {
				console.log(status)
			})
	}

	// Get all boards from database belonging to current user
	async function getAllData() {
		const { data, error } = await GetUserData()
		if (data) {
			userData.value = data
		}
		if (error) {
			console.error(error)
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
			const tempArray = userData.value.slice()
			tempArray.push(data[0] as Module)
			userData.value = tempArray
		}
	}

	return { isSubscribed, userData, getAllData, createNewModule }
})
