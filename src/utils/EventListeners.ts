import { onBeforeUnmount, onMounted } from 'vue'

// This function attaches an event listener to the window that will call the callback function when the user clicks outside of the component
export function attachClickAwayEvent(component: any, callback: Function, exclude: HTMLElement) {
	if (!component) return
	const listener = async (event: Event) => {
		// If the target is the button clicked to open the menu - ignore the event
		if (event.target === exclude) {
			return
		}

		// If the element clicked was a child of the context menu - ignore the event
		if (event.target !== component.value && event.composedPath().includes(component.value)) {
			return
		}

		// use a callback to handle any clicks outside of the component
		if (typeof callback === 'function') {
			callback()
		}
	}
	onMounted(() => { window.addEventListener('click', listener) })
	onBeforeUnmount(() => { window.removeEventListener('click', listener) })

	return { listener }
}