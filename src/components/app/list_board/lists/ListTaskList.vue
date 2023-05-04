<template>
	<div class="list">
		<div class="top-section">
			<span class="list-drag-handle">
				<font-awesome-icon icon="fa-solid fa-grip-vertical" />
			</span>
			<button class="dropdown-button"
				:class="{ open: contentsOpen }"
				@click="contentsOpen = !contentsOpen">
				<font-awesome-icon icon="fa-solid fa-caret-down" />
			</button>
			<p>{{ props.list.name }}</p>
			<span class="wip-limit"
				:class="workInProgressSeverity"
				v-if="props.list.work_in_progress_limit">
				{{ `${props.list.tasks?.length} /
								${props.list.work_in_progress_limit}` }}
			</span>
			<button class="add-button"
				@click="newTaskFormIsOpen = true">
				<font-awesome-icon icon="fa-solid fa-plus" />
			</button>
			<button class="options-button"
				@click="currentBoardStore.setCurrentListOverview(props.list)">
				<font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
			</button>
		</div>
		<Sortable class="list-contents"
			v-if="contentsOpen"
			tag="div"
			@end="handleCardMove"
			:list="props.list.tasks"
			itemKey="id"
			:options="listOptions"
			:data-list-index="props.listIndex">
			<template #item="{ element }">
				<ListTaskCard :task="element"
					:key="element.id" />
			</template>
		</Sortable>
	</div>
	<NewTaskForm :list-index="props.listIndex"
		v-if="newTaskFormIsOpen"
		@close-modal="newTaskFormIsOpen = false" />
</template>

<script setup lang="ts">
// Would rather this be the same component as TaskList.vue, but it would make the template a nightmare to read
import type { List } from '@/types/DatabaseTypes';
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore';
import { computed, ref } from 'vue';
import { Sortable } from 'sortablejs-vue3';
import ListTaskCard from '../tasks/ListTaskCard.vue';
import NewTaskForm from '../tasks/NewTaskForm.vue';
export interface ListTaskListProps {
	list: List,
	listIndex: number
}
const props = defineProps<ListTaskListProps>()
const currentBoardStore = useCurrentBoardStore()
const contentsOpen = ref<boolean>(true)
const newTaskFormIsOpen = ref<boolean>(false)

// dynamically calculates the severity of the work in progress limit
// used for the color of the work in progress limit
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

const listOptions = computed(() => {
	return {
		group: 'tasks',
		delayOnTouchOnly: true,
		delay: 100,
		animation: 150,
		handle: '.task-drag-handle',

		ghostClass: 'sortable-ghost',
		chosenClass: 'sortable-chosen',
		dragClass: 'sortable-drag',
		forceFallback: true,
		disabled: currentBoardStore.filter !== ''
	}
})

// Handles moving cards between lists
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
	width: 100%;

	&:last-of-type {
		margin-bottom: toRem(16);
	}

	&.sortable-ghost {
		opacity: 0.5;
		background-color: var(--background-inset);
		border-radius: 8px;
	}

	.top-section {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		gap: toRem(16);

		border-bottom: 1px solid var(--border);

		.list-drag-handle {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: toRem(40);
			height: toRem(40);
			font-size: toRem(14);

			&:hover {
				cursor: grab;
			}
		}

		p {
			width: 100%;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}

		button {
			flex-shrink: 0;
			@include squared-button;
		}

		.dropdown-button {
			svg {
				transition: transform 0.2s ease;
				@include body-large;
			}

			&.open {
				svg {
					transform: rotate(-180deg);
				}
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
	}

	.list-contents {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: toRem(16);
		gap: toRem(8);
	}
}
</style>