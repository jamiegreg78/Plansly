<template>
	<div class="task-card"
		:class="{ draggable: currentBoardStore.filter === '' }"
		:data-task-id="task.id">
		<div class="task-info">
			<button class="completed-status"
				:class="{ completed: props.task.completed }"
				@click="currentBoardStore.toggleTaskCompleted(props.task)">
				<font-awesome-icon v-if="props.task.completed"
					icon="fa-solid fa-circle-check" />
				<font-awesome-icon v-else
					icon="fa-regular fa-circle-check" />
			</button>
			<p class="task-name">{{ props.task.name }}</p>
			<button class="options-button open-context-menu"
				ref="contextMenuButtonRef"
				@click="currentBoardStore.currentTaskOverview = props.task">
				<font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
			</button>
		</div>
		<div class="task-additional-info">
			<span class="date"
				v-if="props.task.expected_start_date || props.task.expected_finish_date">
				<font-awesome-icon icon="fa-regular fa-calendar" />
				{{ computedDate }}
			</span>
			<div class="tag-container">
				<span class="tag"
					v-for="tag, index in getTags(5)"
					:key="index">
					{{ tag }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import type { Task } from '@/types/DatabaseTypes'
import { computed } from 'vue';

export interface TaskCardProps {
	task: Task,
}
const props = defineProps<TaskCardProps>()

const computedDate = computed(() => {
	if (props.task.expected_start_date?.length && !props.task.expected_finish_date?.length) {
		const date = new Date(props.task.expected_start_date)
		return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
	} else if (props.task.expected_finish_date?.length && !props.task.expected_start_date?.length) {
		const date = new Date(props.task.expected_finish_date)
		return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
	} else if (props.task.expected_finish_date?.length && props.task.expected_start_date?.length) {
		const start = new Date(props.task.expected_start_date)
		const finish = new Date(props.task.expected_finish_date)
		return `${start.getDate()}/${start.getMonth() + 1}/${start.getFullYear()} - ${finish.getDate()}/${finish.getMonth() + 1}/${finish.getFullYear()} `
	}
	return ''
})

const currentBoardStore = useCurrentBoardStore()

function getTags(quantity: number) {
	if (props.task.tags) {
		return props.task.tags.slice(0, quantity)
	}
	return []
}
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

		.completed-status {
			padding: 0;
			margin-right: toRem(4);
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

		.task-name {
			@include regular-semibold;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			margin: 0;
			flex-grow: 1;
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
		display: flex;
		flex-direction: column;
		gap: toRem(4);

		.date {
			display: block;
			font-size: toRem(14);
			color: var(--text-subtext);
		}

		.tag-container {
			display: flex;
			gap: toRem(4);
			flex-wrap: wrap;

			.tag {
				@include tag-chip;
			}
		}
	}

	&.draggable:hover {
		cursor: grab;
	}
}
</style>