<template>
	<section class="board-view">
		<div class="board-info">
			<h1>{{ currentBoardStore.currentBoard?.name }}</h1>
			<button class="settings-button">
				<font-awesome-icon icon="fa-solid fa-gear" />
			</button>
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
		<div class="actions-container">
			<input type="text" placeholder="Search" />
			<span class="filter-button">
				<span>Filter</span>
			</span>
			<button class="add-task-button">
				Add Task
			</button>
		</div>
		<div class="board-content">
			<TaskList v-for="(item, index) in currentBoardStore?.currentBoard?.lists" :key="index" :list="item" />
			<NewList />
			<TaskOverview v-if="currentBoardStore.currentTaskOverview" />
		</div>
	</section>
</template>


<script setup lang="ts">
import NewList from '@/components/app/board/lists/NewList.vue'
import TaskList from '@/components/app/board/lists/TaskList.vue'
import TaskOverview from '@/components/app/board/tasks/TaskOverview.vue'
import { AppRoutes } from '@/router/RouteNames'
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const currentBoardStore = useCurrentBoardStore()

onBeforeMount(() => {
	currentBoardStore.loadCurrentBoard()
})
</script>

<style lang="scss">
section.board-view {
	display: flex;
	flex-direction: column;

	.board-info {
		display: flex;
		padding: toRem(16);
		justify-content: space-between;
		align-items: center;

		border-bottom: 1px solid var(--border);
		color: var(--text-primary);

		.settings-button {
			@include squared-button;
		}

		h1 {
			margin: 0;
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

	.actions-container {
		padding: toRem(16);
	}

	.board-content {
		flex-grow: 1;

		padding: toRem(16);
		display: flex;
		gap: toRem(16);
		overflow-x: auto;

		&.prevent-scroll {
			overflow: hidden;
		}


		.list {
			flex-shrink: 0;
		}
	}
}
</style>