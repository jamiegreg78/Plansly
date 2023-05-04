<template>
	<div class="list"
		:class="{ draggable: currentBoardStore.filter === '' }">
		<div class="top-section">
			<p>{{ props.list.name }}</p>
			<span class="wip-limit"
				:class="workInProgressSeverity"
				v-if="props.list.work_in_progress_limit">
				{{ `${props.list.tasks?.length} /
								${props.list.work_in_progress_limit}` }}
			</span>
			<button class="options-button"
				@click="currentBoardStore.setCurrentListOverview(props.list)">
				<font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
			</button>
		</div>
		<Sortable class="list-contents"
			tag="div"
			@end="handleCardMove"
			:list="props.list.tasks"
			itemKey="id"
			:options="listOptions"
			:data-list-index="props.listIndex">
			<template #item="{ element }">
				<TaskCard :task="element"
					:key="element.id" />
			</template>
		</Sortable>
		<NewTask :list-index="props.listIndex" />
	</div>
</template>

<script setup lang="ts">
import type { List } from '@/types/DatabaseTypes'
import NewTask from '@/components/app/board/tasks/NewTask.vue'
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import { Sortable } from 'sortablejs-vue3'
import TaskCard from '../tasks/TaskCard.vue'
import { computed } from 'vue'

export interface TaskListProps {
	list: List,
	listIndex: number
}
const props = defineProps<TaskListProps>()
const currentBoardStore = useCurrentBoardStore()

// Calculates the class for the work in progress limit
// used to handle the color of the work in progress limit
const workInProgressSeverity = computed(() => {
	if (typeof props.list.tasks !== 'undefined' && props.list.work_in_progress_limit) {
		const currentWorkInProgressPercentage: number = props.list.tasks?.length / props.list.work_in_progress_limit
		if (currentWorkInProgressPercentage > 1) {
			return 'high'
		} else if (currentWorkInProgressPercentage >= 0.75) {
			return 'medium'
		} else {
			return 'low'
		}
	}
	return ''
})

// The options for the list. 
// Delay on touch only is used to prevent the list from being dragged when scrolling
const listOptions = computed(() => {
	return {
		group: 'tasks',
		delayOnTouchOnly: true,
		delay: 100,
		animation: 150,

		ghostClass: 'sortable-ghost',
		chosenClass: 'sortable-chosen',
		dragClass: 'sortable-drag',
		forceFallback: true,
		disabled: currentBoardStore.filter !== ''
	}
})

// Handles the movement of the card
// Calls different functions depending on if the card is moved within the same list or between lists
function handleCardMove(movementData: any) {
	const fromListIndex: number = movementData.from.dataset.listIndex
	const toListIndex: number = movementData.to.dataset.listIndex
	const oldIndex: number = movementData.oldIndex
	const newIndex: number = movementData.newIndex

	// move within the same list
	if (fromListIndex === toListIndex) {
		currentBoardStore.moveCardWithinSameList(fromListIndex, oldIndex, newIndex)
	} else {
		// Move between lists
		movementData.item.remove()
		currentBoardStore.moveCardsBetweenLists(fromListIndex, toListIndex, oldIndex, newIndex)
	}
}
</script>

<style lang="scss" scoped>
.list {
	width: toRem(350);
	max-width: 100%;
	max-height: 100%;

	padding: 0 toRem(10);

	.sortable-ghost {
		opacity: 0.5;
	}

	.top-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: toRem(4);
		padding-top: toRem(10);

		p {
			width: 100%;
			border: none;
			width: 100%;
			padding: toRem(8);
			margin: 0;

			border: none;
			@include regular-semibold;

			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;

			&:focus {
				outline: none;
				border-bottom: 2px solid var(--border);
			}

			&::placeholder {
				opacity: 1;
				color: var(--text-primary);
			}
		}

		.wip-limit {
			flex-shrink: 0;
			padding: toRem(4) toRem(8);
			border-radius: 16px;

			color: var(--white);

			&.low {
				background: var(--green);
			}

			&.medium {
				background: var(--orange);
			}

			&.high {
				background: var(--red);
			}
		}

		.options-button,
		.new-task-button {
			@include squared-button;
			flex-shrink: 0;
		}
	}

	.list-contents {
		padding: toRem(10) 0;
		display: flex;
		flex-direction: column;
		gap: toRem(10);
		max-height: 85%;
		overflow-y: auto;
	}

	&.draggable {
		.top-section {
			&:hover {
				cursor: grab;
			}
		}
	}
}
</style>