<template>
	<div class="board-list-container">
		<div class="title-container">
			<h2>Boards</h2>
		</div>
		<div class="board-list">
			<div class="board-item new-board" @click="$emit('open')">
				<span class="board-icon">
					<font-awesome-icon icon="fa-solid fa-plus" />
				</span>
				<p>Create board</p>
			</div>
			<div class="board-item" v-for="(item, index) in props.boards" :key="index">
				<span class="board-icon" :style="{ 'background-color': item.color?.hexValue }">
					<font-awesome-icon icon="fa-solid fa-list-check"
						:style="{ 'color': item.color?.hexValue ? '#fff' : 'var(--text-primary)' }" />
				</span>
				<p>{{ item.name }}</p>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { AppRoutes } from '@/router/RouteNames'
import type { Board } from '@/types/DatabaseTypes'
import { useRouter } from 'vue-router'

export interface BoardListProps {
	boards: Array<Board>
}
const props = defineProps<BoardListProps>()
const emit = defineEmits(['open'])

const router = useRouter()
</script>

<style lang="scss">
.board-list-container {
	width: 100%;
	border-radius: toRem(8);

	@include breakpoint(desktop) {
		//width: 50%;
		@include drop-shadow;
	}

	.title-container {
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
			padding: toRem(8);

			border-radius: 8px;

			@include breakpoint(tablet) {
				width: calc(50% - toRem(8));
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