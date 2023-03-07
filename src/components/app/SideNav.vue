<template>
	<nav id="side-nav" :class="{ open: interfaceStore.navIsDisplayed }">
		<div class="top-section">
			<span class="username">
				{{ authenticationStore.authState.email?.split('@')[0] }}
			</span>
			<button class="close-nav-button" @click="toggleNav">
				<font-awesome-icon icon="fa-solid fa-chevron-left" />
			</button>
		</div>
		<div class="nav-content">
			<RouterLink to="test" class="root-level-link nav-button">
				<font-awesome-icon icon="fa-regular fa-window-maximize" />
				Dashboard
			</RouterLink>
			<RouterLink to="test" class="root-level-link nav-button">
				<font-awesome-icon icon="fa-regular fa-folder" />
				Modules
			</RouterLink>
			<RouterLink to="test" class="root-level-link nav-button">
				<font-awesome-icon icon="fa-regular fa-calendar" />
				Upcoming
			</RouterLink>
		</div>
		<div class="bottom-section">
			<span class="logout" @click="logOut">
				<font-awesome-icon icon="fa-solid fa-right-from-bracket" />
				Log Out
			</span>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import { useInterfaceStore } from '@/stores/InterfaceStore'
import { LogOutUser } from '@/backend/Authentication'
import { useRouter } from 'vue-router'

const authenticationStore = useAuthenticationStore()
const interfaceStore = useInterfaceStore()
const router = useRouter()

function toggleNav() {
	interfaceStore.toggleNav()
}

async function logOut() {
	await LogOutUser()
	router.go(0)
}

</script>

<style lang="scss">
#side-nav {
	z-index: 5;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 0%;
	max-width: 100vw;
	height: 100vh;
	overflow: hidden;

	background-color: var(--background);
	border-right: 1px solid var(--border);
	transition: width 0.3s ease;

	&.open {
		width: 100%;
	}

	@include breakpoint(tablet) {
		position: static;
		max-width: toRem(360);
	}

	.top-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: toRem(24);

		padding: toRem(18);

		border-bottom: 1px solid var(--border);

		.username {
			display: block;
			@include body-large;
		}

		.close-nav-button {
			border: none;
			background: none;
			display: flex;
			justify-content: center;
			align-items: center;
			width: toRem(40);
			height: toRem(40);

			font-size: toRem(18);
			color: var(--text-primary);

			&:hover {
				cursor: pointer;
				background: var(--background-inset);
				border-radius: 50%;
			}
		}
	}

	.nav-content {
		flex-basis: 100%;
	}

	.bottom-section {
		border-top: 1px solid var(--border);
	}

	.nav-content,
	.bottom-section {
		display: flex;
		flex-direction: column;
		justify-content: start;
		padding: toRem(18) toRem(32);
		gap: toRem(10);


		a,
		span {
			display: flex;
			align-items: center;
			gap: toRem(12);
			padding: toRem(10);

			@include regular-semibold;
			text-decoration: none;
			border-radius: toRem(8);


			&:hover {
				background-color: var(--background-inset);
				cursor: pointer;
			}

		}
	}
}
</style>