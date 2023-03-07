<template>
	<RouterView />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'
import { GetUserSession } from './backend/Authentication'
import { useAuthenticationStore } from './stores/AuthenticationStore'

const authState = useAuthenticationStore()

document.querySelector('body')?.setAttribute('data-darkMode', 'false')

// Check if the user is authenticated and store it
onBeforeMount(async () => {
	const { data, error } = await GetUserSession()
	if (data.session?.user) {
		authState.setAuthState(data.session.user)
	}
	if (error) {
		console.error(error)
	}
})

//TODO: Implement this properly

// Detect the user color scheme and attach a listener to update the scheme in future
// onBeforeMount(() => {
// 	const themeAttribute: string = 'data-darkMode'
// 	const mediaQuery: string = '(prefers-color-scheme: dark)'
// 	const docBody = document.querySelector('body')

// 	// check if this css rule is supported
// 	if (window.matchMedia) {
// 		// initial value
// 		docBody?.setAttribute(themeAttribute, window.matchMedia(mediaQuery).matches.toString())

// 		// event listener for future changes
// 		window.matchMedia(mediaQuery).addEventListener('change', event => {
// 			document.querySelector('body')?.setAttribute(themeAttribute, event.matches.toString())
// 		})
// 	} else {
// 		docBody?.setAttribute('data-darkMode', 'false')
// 	}

// })

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');

* {
	box-sizing: border-box;
	font-family: 'Open Sans', sans-serif;

	transition-property: color, background-color, background, border-color;
	transition-duration: 0.3s;
	transition-timing-function: ease;
}

html,
body {
	margin: 0;
	padding: 0;
	background-color: var(--background);
	height: 100%;
	width: 100%;
}

#app {
	min-height: 100%;
}
</style>
