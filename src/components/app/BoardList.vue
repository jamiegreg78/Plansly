<template>
	<div class="board-list-container">
		<div class="title-container">
			<h2>Boards</h2>
		</div>
		<div class="board-list">
			<div class="board-item new-board"
				@click="$emit('open')">
				<span class="board-icon">
					<font-awesome-icon icon="fa-solid fa-plus" />
				</span>
				<p>Create board</p>
			</div>
			<div class="board-item"
				v-for="(item, index) in props.boards"
				:key="index"
				@click="router
						.push(AppRoutes.board.replace(':moduleId', router.currentRoute.value.params.moduleId as string)
							.replace(':boardId', item.id.toString())
						)">
				<span class="board-icon"
					:style="{ 'background-color': item.color?.hexValue }">
					<font-awesome-icon icon="fa-solid fa-list-check"
						:style="{ 'color': item.color?.hexValue ? '#fff' : 'var(--text-primary)' }" />
				</span>
				<p>{{ item.name }}</p>
				<button class="delete-button"
					@click.stop="() => {
						deletingBoardId = item.id
						deletingModuleId = parseInt(router.currentRoute.value.params.moduleId as string)
					}"
					tabindex="0">
					<font-awesome-icon icon="fa-solid fa-xmark" />
				</button>
			</div>
		</div>
		<Delete v-if="deletingBoardId !== null"
			mode="board"
			@cancel="() => {
					deletingBoardId = null
					deletingModuleId = null
				}"
			@confirm="deleteBoard"
			:id="deletingBoardId" />
	</div>
</template>
<script setup lang="ts">
import { AppRoutes } from '@/router/RouteNames'
import type { Board } from '@/types/DatabaseTypes'
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { useUserDataStore } from '@/stores/UserDataStore';
import Delete from './Delete.vue';

export interface BoardListProps {
	boards: Array<Board>
}
const props = defineProps<BoardListProps>()
const emit = defineEmits(['open'])
const userDataStore = useUserDataStore()

const router = useRouter()
const deletingBoardId = ref<number | null>(null)
const deletingModuleId = ref<number | null>(null)

async function deleteBoard() {
	if (deletingBoardId.value !== null && deletingModuleId.value !== null) {
		await userDataStore.deleteBoard(deletingModuleId.value, deletingBoardId.value)
		deletingBoardId.value = null
		deletingModuleId.value = null
	}
}
</script>

<style lang="scss">
.board-list-container {
	width: 100%;
	border-radius: toRem(8);
	overflow-y: auto;

	@include breakpoint(desktop) {
		@include drop-shadow;
	}

	.title-container {
		position: sticky;
		background-color: var(--background);
		top: 0;
		width: 100%;
		border-bottom: 1px solid var(--border);
		padding: toRem(16);

		h2 {
			@include body-large;
			margin: 0;
		}
	}

	.board-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		row-gap: toRem(16);
		padding: toRem(16) 0;

		@include breakpoint(tablet) {
			padding: toRem(16);
		}

		.board-item {
			width: 100%;
			display: flex;
			align-items: center;
			padding: toRem(8);

			border-radius: 8px;

			@include breakpoint(tablet) {
				width: calc(50% - toRem(8));
			}

			.delete-button {
				@include squared-button;
			}

			.board-icon {
				display: flex;
				justify-content: center;
				align-items: center;
				width: toRem(50);
				height: toRem(50);
				margin-right: toRem(10);
				@include body-small;

				font-size: toRem(24);

				border-radius: 8px;

				svg {
					color: var(--white);
				}
			}

			&:not(.new-board) {
				justify-content: space-between;

				p {
					flex-grow: 1;
				}

				* {
					flex-shrink: 0;
				}
			}

			&.new-board {
				.board-icon {
					background-color: var(--background-inset);
					border: 1px solid var(--border);

					svg {
						color: var(--text-primary);
					}
				}
			}

			&:hover {
				cursor: pointer;

				background-color: var(--background-inset);
			}
		}
	}

}
</style>