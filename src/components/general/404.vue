<template>
	<div class="page-404">
		<h1>404</h1>
		<h2>Page not found</h2>
		<p>Sorry, the page you are looking for does not exist.</p>
		<ButtonComponent text="Return"
			:is-primary="true"
			:tab-index="0"
			@clicked="router.push(AppRoutes.dashboard)" />
	</div>
</template>

<script setup lang="ts">
import { AppRoutes } from '@/router/RouteNames';
import ButtonComponent from './ButtonComponent.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

</script>

<style lang="scss">
.page-404 {
	padding: toRem(16);
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;

	justify-content: center;
	align-items: center;

	color: var(--text-primary);

	h1 {
		font-size: 5rem;
		font-weight: 700;
		margin: 0;
	}

}
</style>