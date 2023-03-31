<template>
	<section class="overview-view"
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
		<div class="board-content">
			<TextInput label="Board Name"
				type="text"
				show-label
				v-model="boardName" />
			<TextInput label="Board Description"
				type="text"
				show-label
				v-model="boardDescription"
				multi-line />
			<ButtonComponent text="Save Changes"
				@click="updateBoard"
				is-primary
				:tab-index="0" />
		</div>
	</section>
	<LoadingSpinner v-else />
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore';
import { AppRoutes } from '@/router/RouteNames';
import { useRouter } from 'vue-router';
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import ButtonComponent from '@/components/general/ButtonComponent.vue';

const router = useRouter()
const currentBoardStore = useCurrentBoardStore()

const boardName = ref<string>('')
const boardDescription = ref<string>('')

onBeforeMount(async () => {
	const results = await currentBoardStore.loadCurrentBoard()
	if (results?.data.length === 0) {
		router.push(AppRoutes.notFound)
	} else {
		boardName.value = results?.data[0].name
		boardDescription.value = results?.data[0].description || ''
	}
})

function updateBoard() {
	currentBoardStore.changeBoardDetails({
		name: boardName.value,
		description: boardDescription.value
	})
}

</script>

<style lang="scss">
section.overview-view {
	display: flex;
	flex-direction: column;

	.board-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: toRem(16);
		border-bottom: 1px solid var(--border);

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

	.board-content {
		padding: toRem(16);

		textarea {
			resize: vertical;
		}
	}
}
</style>
