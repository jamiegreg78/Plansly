import { ref } from 'vue'
import { defineStore } from 'pinia'

// This store is used to store any global state that is related to the interface.
// Currently it only stores the state of the navigation bar.
// This store will be expanded in the future when new features are added
export const useInterfaceStore = defineStore('interfaceStore', () => {
	const navIsDisplayed = ref<boolean>(window.innerWidth >= 768 ? true : false)
	
	function toggleNav() {
		navIsDisplayed.value = !navIsDisplayed.value
	}
	
	return { navIsDisplayed, toggleNav}
	// This store persists through page reloads via localStorage
	// currently means that the sidebar will be open on page reload if it was open before and vice versa
}, {persist: {
	enabled: true,
	strategies: [
		{
			storage: localStorage
		}
	]
}})