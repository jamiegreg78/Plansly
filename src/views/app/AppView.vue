<template>
	<section class="app-container">
		<SideNav />

		<div class="page-content">
			<TopAppBar />
			<h1 class="page-title">{{ router.currentRoute.value.name }}</h1>
			<RouterView v-if="userData.hasInitialised" />
			<span v-else>PLACEHOLDER LOADER</span>
		</div>

	</section>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import SideNav from '@/components/app/SideNav.vue'
import TopAppBar from '@/components/app/TopBar.vue'
import { onMounted } from 'vue'
import { useUserDataStore } from '@/stores/UserDataStore'
const router = useRouter()
const userData = useUserDataStore()

onMounted(() => {
	// TODO: Research this properly: Might be worth in the long run - potential costs?
	// if (!userData.isSubscribed) {
	// userData.subscribeToModules()
	// }
	userData.getAllData()
})

</script>

<style lang="scss">
.app-container {
	width: 100%;
	height: 100%;
	display: flex;

	section {
		// TODO: This is questionable at best
		// height: calc(100vh - toRem(125));
		// max-height: calc(100vh - toRem(125));
		min-height: calc(100vh - toRem(125));
		overflow-y: auto;
	}

	.page-content {
		width: 100%;
		height: 100%;

		.page-title {
			@include body-large;
			width: 100%;
			margin: 0;
			padding: toRem(18) toRem(24);

			border-bottom: 1px solid var(--border);
			position: sticky;
			top: toRem(55);
			background-color: var(--background);
		}
	}

}
</style>