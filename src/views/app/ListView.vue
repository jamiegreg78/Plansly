<template>
	<section class="board-list-view"
		v-if="currentBoardStore.currentBoard">
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
			<BoardSearchInput />
		</div>
		<div class="board-content">
			<Sortable class="list-container"
				tag="div"
				@end="handleListMove"
				:list="currentBoardStore.filteredBoard ? currentBoardStore.filteredBoard?.lists : currentBoardStore.currentBoard?.lists"
				itemKey="id"
				:options="listOptions">
				<template #item="{ element, index }">
					<ListTaskList :list="element"
						:listIndex="index" />
				</template>
			</Sortable>
			<NewList />
			<TaskOverview v-if="currentBoardStore.currentTaskOverview" />
			<ListOverview v-if="currentBoardStore.currentListOverview" />
		</div>
	</section>

	<LoadingSpinner v-else />
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore';
import { onBeforeMount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { AppRoutes } from '@/router/RouteNames';
import { Sortable } from 'sortablejs-vue3';
import TaskOverview from '@/components/app/board/tasks/TaskOverview.vue';
import ListOverview from '@/components/app/board/lists/ListOverview.vue';
import NewList from '@/components/app/board/lists/NewList.vue';
import ListTaskList from '@/components/app/list_board/lists/ListTaskList.vue';
import BoardSearchInput from '@/components/inputs/BoardSearchInput.vue';

const currentBoardStore = useCurrentBoardStore();
const router = useRouter();

onBeforeMount(async () => {
	const results = await currentBoardStore.loadCurrentBoard()
	if (results?.data.length === 0) {
		router.push(AppRoutes.notFound)
	}
});

const listOptions = computed(() => {
	return {
		group: 'lists',
		delayOnTouchOnly: true,
		delay: 100,
		animation: 150,
		handle: '.list-drag-handle',

		ghostClass: 'sortable-ghost',
		chosenClass: 'sortable-chosen',
		dragClass: 'sortable-drag',
		forceFallback: true,
		disabled: currentBoardStore.filter !== ''
	}
})

function handleListMove(movementData: any) {
	const oldIndex: number = movementData.oldIndex;
	const newIndex: number = movementData.newIndex;

	currentBoardStore.moveList(oldIndex, newIndex)
}
</script>

<style lang="scss">
section.board-list-view {
	display: flex;
	flex-direction: column;

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

	.actions-container {
		display: flex;
		padding: toRem(16);
		padding-bottom: 0;
		flex-wrap: wrap;

		@include breakpoint(tablet) {
			gap: toRem(12);
		}

		.filter-container {
			width: 100%;

			@include breakpoint(tablet) {
				width: toRem(250);
			}
		}

		#BoardSearchContainer {
			width: 100%;

			@include breakpoint(tablet) {
				width: toRem(350);
			}
		}
	}

	.board-content {
		padding: toRem(16)
	}
}
</style>