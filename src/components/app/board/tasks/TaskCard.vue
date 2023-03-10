<template>
	<div class="task-card">
		<div class="task-info">
			<input type="text" v-model="inputValue" @blur="closeInput" @keydown.enter="closeInput" @keydown.esc="closeInput"
				:placeholder="props.task.name" />
			<button class="options-button">
				<font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import type { Task } from '@/types/DatabaseTypes'
import { ref } from 'vue'

export interface TaskCardProps {
	task: Task
}
const props = defineProps<TaskCardProps>()

const currentBoardStore = useCurrentBoardStore()

const inputValue = ref<string>('')

async function closeInput(event: Event) {
	document.getElementById('newListInput')?.blur()

	if (inputValue.value.length && (event as KeyboardEvent).key !== 'Escape') {
		// currentBoardStore.createNewCard(inputValue.value, props.listId)
	}
}
</script>

<style lang="scss">
.task-card {
	background: var(--background);

	border: 1px solid var(--border);
	border-radius: 8px;

	padding: toRem(16);


	.task-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: toRem(4);

		input {
			width: 100%;
			padding: toRem(8);

			border: none;
			border-bottom: 2px solid transparent;
			@include regular-semibold;

			&:focus {
				outline: none;
				border-bottom: 2px solid var(--border);
			}

			&::placeholder {
				opacity: 1;
				color: var(--text-primary);
			}
		}

		.options-button,
		.new-task-button {
			flex-shrink: 0;
			width: toRem(40);
			height: toRem(40);
			// margin-left: toRem(4);

			background: none;
			border: none;
			border-radius: 8px;

			@include regular-semibold;
			font-size: toRem(20);
			border: transparent;

			&:hover {
				cursor: pointer;
				background: var(--background-inset);
				border: 1px solid var(--border);
			}
		}

	}


	&:hover {
		cursor: pointer;
	}
}
</style>