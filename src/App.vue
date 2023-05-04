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

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');

* {
	box-sizing: border-box;
	font-family: 'Open Sans', sans-serif;

	/* transition-property: color, background-color, background, border-color; */
	/* transition-duration: 0.3s; */
	/* transition-timing-function: ease; */
}

button {
	cursor: pointer;
}

html,
body,
#app {
	margin: 0;
	padding: 0;
	background-color: var(--background);
	height: 100%;
	width: 100%;
	max-width: 100vw;
}
</style>
