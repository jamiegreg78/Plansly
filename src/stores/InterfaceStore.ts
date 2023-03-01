import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useInterfaceStore = defineStore('interfaceStore', () => {
	const navIsDisplayed = ref<boolean>(true)
	

	function toggleNav() {
		navIsDisplayed.value = !navIsDisplayed.value
	}
	
	return { navIsDisplayed, toggleNav}
}, {persist: {
	enabled: true,
	strategies: [
		{
			storage: localStorage
		}
	]
}})