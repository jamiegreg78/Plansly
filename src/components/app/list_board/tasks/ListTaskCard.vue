<template>
	<div class="task-card"
		:data-task-id="task.id">
		<div class="task-info">
			<span class="task-drag-handle">
				<font-awesome-icon icon="fa-solid fa-grip-vertical" />
			</span>
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
				<Chip :class="tag"
					v-if="props.task.tags?.length"
					v-for="tag, index in props.task.tags.slice(0, 5)"
					:text="tag"
					:key="index" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/DatabaseTypes';
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore';
import { computed } from 'vue';
import Chip from '@/components/general/Chip.vue';

export interface ListTaskCardProps {
	task: Task
}
const props = defineProps<ListTaskCardProps>()

const currentBoardStore = useCurrentBoardStore()

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
</script>

<style lang="scss" scoped>
.task-card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	padding-bottom: toRem(8);
	border-bottom: 1px solid var(--border);


	&.sortable-ghost {
		opacity: 0.5;
		background-color: var(--background-inset);
		border-radius: 8px;
		border-color: transparent;
	}

	.task-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		gap: toRem(8);

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

		.options-button {
			flex-shrink: 0;
			@include squared-button;
		}

		.task-name {
			width: 100%;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		.task-drag-handle {
			display: flex;
			justify-content: center;
			align-items: center;
			width: toRem(40);
			height: toRem(40);
			@include regular-semibold;
			font-size: toRem(12);
			flex-shrink: 0;

			&:hover {
				cursor: grab;
			}
		}

	}

	.task-additional-info {
		display: flex;
		flex-direction: column;
		gap: toRem(4);
		padding: 0 toRem(16);

		.date {
			display: block;
			color: var(--text-subtext);
			font-size: toRem(14);
		}

		.tag-container {
			display: flex;
			gap: toRem(4);
			flex-wrap: wrap;
		}
	}
}
</style>