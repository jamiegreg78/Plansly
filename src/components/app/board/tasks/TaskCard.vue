<template>
	<div class="task-card">
		<div class="task-info">
			<p class="task-name">{{ props.task.name }}</p>
			<button class="options-button open-context-menu" ref="contextMenuButtonRef" @click="contextMenuIsOpen = true">
				<font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
			</button>
		</div>
	</div>
	<ContextMenu :items="contextMenuItems" :exclude="contextMenuButtonRef" v-if="contextMenuIsOpen"
		@close-context-menu="contextMenuIsOpen = false" />
</template>

<script setup lang="ts">
import ContextMenu, { type ContextMenuItems } from '@/components/general/ContextMenu.vue'
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import type { Task } from '@/types/DatabaseTypes'
import { ref } from 'vue'

export interface TaskCardProps {
	task: Task
}
const props = defineProps<TaskCardProps>()

const currentBoardStore = useCurrentBoardStore()

const inputValue = ref<string>('')
const contextMenuIsOpen = ref<boolean>(false)
const contextMenuButtonRef = ref()

const contextMenuItems: Array<ContextMenuItems> = [
	{
		text: 'View Task',
		icon: 'fa-solid fa-pen-to-square',
		callback: () => {
			console.log('CLICKED VIEW TASK')
		}
	},
	{
		text: 'View Task',
		icon: 'fa-solid fa-pen-to-square',
		callback: () => {
			console.log('CLICKED VIEW TASK')
		}
	},
	{
		text: 'View Task',
		icon: 'fa-solid fa-pen-to-square',
		callback: () => {
			console.log('CLICKED VIEW TASK')
		}
	},
	{
		text: 'View Task',
		icon: 'fa-solid fa-pen-to-square',
		callback: () => {
			console.log('CLICKED VIEW TASK')
		}
	}
]

</script>

<style lang="scss">
.task-card {
	background: var(--background);

	border: 1px solid var(--border);
	border-radius: 8px;

	padding: toRem(16);
	transition: box-shadow 0.15s ease;


	.task-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: toRem(4);

		.task-name {
			@include regular-semibold;
		}

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

			svg {
				pointer-events: none;
			}

			&:hover {
				cursor: pointer;
				background: var(--background-inset);
				border: 1px solid var(--border);
			}
		}

	}


	&:hover {
		cursor: pointer;
		@include drop-shadow;
	}
}
</style>