<template>
	<div class="board-info">
		<h1>{{ currentBoardStore.currentBoard?.name }}</h1>
	</div>

	<div class="link-container">
		<RouterLink
			:to="AppRoutes.overview.replace(':moduleId', router.currentRoute.value.params.moduleId as string).replace(':boardId', router.currentRoute.value.params.boardId as string)">
			Overview
		</RouterLink>
		<RouterLink
			:to="AppRoutes.board.replace(':moduleId', router.currentRoute.value.params.moduleId as string).replace(':boardId', router.currentRoute.value.params.boardId as string)">
			Board
		</RouterLink>
		<RouterLink
			:to="AppRoutes.list.replace(':moduleId', router.currentRoute.value.params.moduleId as string).replace(':boardId', router.currentRoute.value.params.boardId as string)">
			List
		</RouterLink>
	</div>
</template>

<script setup lang="ts">
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore';
import { AppRoutes } from '@/router/RouteNames';
import { useRouter } from 'vue-router';
const currentBoardStore = useCurrentBoardStore();
const router = useRouter();

</script>

<style lang="scss">
.board-info {
	display: flex;
	padding: toRem(16);
	justify-content: space-between;
	align-items: center;

	border-bottom: 1px solid var(--border);
	color: var(--text-primary);


	h1 {
		margin: 0;
	}

	.settings-button {
		@include squared-button;
	}
}

.link-container {
	width: 100%;
	display: flex;
	gap: toRem(8);
	padding: toRem(8) toRem(16);

	border-bottom: 1px solid var(--border);

	a {
		display: block;
		@include regular-semibold;
		color: var(--gray);
		text-decoration: none;

		&.router-link-active {
			color: var(--text-primary);

			&::after {
				display: block;
				width: 100%;
				height: toRem(2);
				position: relative;
				top: 0px;

				background-color: var(--text-primary);
				content: "";
			}
		}
	}
}
</style>