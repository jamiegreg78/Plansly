<template>
	<div class="task-card">
		<div class="task-info">
			<p class="task-name">{{ props.task.name }}</p>
			<button class="options-button open-context-menu" ref="contextMenuButtonRef" @click="contextMenuIsOpen = true">
				<font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
			</button>
		</div>
		<div class="task-additional-info">
			<button class="completed-status" :class="{ completed: props.task.completed }"
				@click="currentBoardStore.toggleTaskCompleted(props.task)">
				<font-awesome-icon v-if="props.task.completed" icon="fa-solid fa-circle-check" />
				<font-awesome-icon v-else icon="fa-regular fa-circle-check" />
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

const contextMenuIsOpen = ref<boolean>(false)
const contextMenuButtonRef = ref()

const contextMenuItems: Array<ContextMenuItems> = [
	{
		text: 'View Task',
		icon: 'fa-solid fa-pen-to-square',
		callback: () => {
			currentBoardStore.setCurrentTaskOverview(props.task)
		}
	},
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
			@include squared-button;
			flex-shrink: 0;
		}
	}

	.task-additional-info {

		.completed-status {
			padding: 0;
			border: none;
			background: transparent;
			@include body-small;

			transition: color 0 ease;

			&.completed {
				color: var(--green);
			}

			&:hover {
				cursor: pointer;
			}
		}
	}

	&:hover {
		cursor: grab;
		@include drop-shadow;
	}
}
</style>