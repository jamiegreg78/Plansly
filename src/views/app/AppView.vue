<template>
	<section class="app-container">
		<SideNav />

		<div class="page-content">
			<TopAppBar />
			<h1 class="page-title">{{ router.currentRoute.value.name }}</h1>
		</div>

		<RouterView />
	</section>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import SideNav from '@/components/app/SideNav.vue'
import TopAppBar from '@/components/app/TopBar.vue'
const router = useRouter()

</script>

<style lang="scss">
.app-container {
	width: 100vw;
	display: flex;

	.page-content {
		width: 100%;


		.page-title {
			@include body-large;
			width: 100%;
			margin: 0;
			padding: toRem(18) toRem(24);

			border-bottom: 1px solid var(--border);
		}
	}

}
</style>