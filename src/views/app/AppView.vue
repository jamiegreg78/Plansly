<template>
	<section class="app-container">
		<SideNav />

		<div class="page-content">
			<TopAppBar v-if="!router.currentRoute.value.meta.noTopBar" />
			<h1 class="page-title"
				v-if="!router.currentRoute.value.meta.noHeader && router.currentRoute.value.name !== '404'">{{
					router.currentRoute.value.name }}</h1>
			<RouterView v-if="userData.hasInitialised" />
			<LoadingSpinner v-else />
		</div>

	</section>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import SideNav from '@/components/app/SideNav.vue'
import TopAppBar from '@/components/app/TopBar.vue'
import { onMounted } from 'vue'
import { useUserDataStore } from '@/stores/UserDataStore'
import type LoadingSpinner from '@/components/general/LoadingSpinner.vue'
const router = useRouter()
const userData = useUserDataStore()

onMounted(() => {
	userData.getAllData()
})

</script>

<style lang="scss">
.app-container {
	width: 100%;
	max-width: 100vw;
	height: 100%;
	display: flex;
	// overflow: hidden;

	.page-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		max-width: 100vw;
		min-width: 0;

		section {
			overflow-y: auto;
			flex-grow: 1;
		}

		.page-title {
			@include body-large;
			width: 100%;
			margin: 0;
			padding: toRem(18) toRem(24);

			border-bottom: 1px solid var(--border);
			top: toRem(55);
			background-color: var(--background);
		}
	}

}
</style>