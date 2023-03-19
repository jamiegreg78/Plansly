<template>
	<div class="list">
		<div class="top-section">
			<p>{{ props.list.name }}</p>
			<button class="new-task-button">
				<font-awesome-icon icon="fa-solid fa-plus" />
			</button>
			<button class="options-button" @click="currentBoardStore.setCurrentListOverview(props.list)">
				<font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
			</button>
		</div>
		<Sortable class="list-contents" tag="div" @end="handleCardMove" :list="props.list.tasks" itemKey="id"
			:options="listOptions" :data-list-index="props.listIndex">
			<template #item="{ element }">
				<TaskCard :task="element" :key="element.id" />
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

export interface TaskListProps {
	list: List,
	listIndex: number
}
const props = defineProps<TaskListProps>()
const currentBoardStore = useCurrentBoardStore()

const listOptions = {
	group: 'tasks',
	delayOnTouchOnly: true,
	delay: 50,
	animation: 150,

	ghostClass: 'sortable-ghost',
	chosenClass: 'sortable-chosen',
	dragClass: 'sortable-drag',
}

// TODO: Correct type for this param?
// TODO: HANDLE DRAGGING INTO EMPTY SPACE!
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

<style lang="scss">
.list {
	// TODO: MAKE THIS A MIXIN
	width: toRem(300);

	padding: 0 toRem(10);

	.sortable-ghost {
		opacity: 0.5;
	}

	.top-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: toRem(4);

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

		.options-button,
		.new-task-button {
			@include squared-button;
			flex-shrink: 0;
		}


		&:hover {
			cursor: grab;
		}
	}

	.list-contents {
		padding: toRem(10) 0;
		display: flex;
		flex-direction: column;
		gap: toRem(10);
	}
}
</style>