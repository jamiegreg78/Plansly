<template>
	<div class="top-bar">
		<button class="open-nav-button" @click="toggleNav">
			<font-awesome-icon icon="fa-solid fa-bars" />
		</button>

	</div>
</template>

<script setup lang="ts">
import { useInterfaceStore } from '@/stores/InterfaceStore'
const interfaceStore = useInterfaceStore()

function toggleNav() {
	interfaceStore.toggleNav()
}
</script>

<style lang="scss">
.top-bar {
	position: sticky;
	top: 0;
	display: flex;
	align-items: center;
	padding: 0 toRem(8);

	width: 100%;
	height: toRem(55);

	background-color: var(--primary);

	.open-nav-button {
		border: none;
		background: none;
		display: flex;
		justify-content: center;
		align-items: center;
		width: toRem(40);
		height: toRem(40);

		font-size: toRem(24);
		color: var(--white);
		border-radius: 50%;

		&:hover {
			cursor: pointer;
		}
	}
}
</style>