<template>
	<div class="upcoming-list">
		<div class="top-section">
			<button class="open-list"
				:class="{ open: listIsOpen }"
				@click="listIsOpen = !listIsOpen">
				<font-awesome-icon icon="fa-solid fa-caret-down" />
			</button>
			<p class="list-name">{{ props.list.date }}</p>
		</div>
		<Sortable class="list-contents"
			:data-list-index="props.listIndex"
			v-if="listIsOpen"
			tag="div"
			@end="handleCardMove"
			:list="props.list.tasks"
			itemKey="id"
			:options="listOptions">
			<template #item="{ element }">
				<ListTaskCard :task="element"
					:key="element.id"
					@toggleCompleted="completeTask"
					isUpcoming />
			</template>
		</Sortable>
		<span class="empty-spot"
			v-if="listIsOpen && !props.list.tasks.length"></span>
	</div>
</template>

<script setup lang="ts">
import type { Task, UpcomingList } from '@/types/DatabaseTypes';
import ListTaskCard from '@/components/app/list_board/tasks/ListTaskCard.vue'
import { Sortable } from 'sortablejs-vue3';
import { computed, ref } from 'vue';
import { useUpcomingTaskStore } from '@/stores/UpcomingTaskStore';

export interface UpcomingListProps {
	list: UpcomingList
	listIndex: number
}
const props = defineProps<UpcomingListProps>()
const upcomingTaskStore = useUpcomingTaskStore()

const listIsOpen = ref<boolean>(true)

function completeTask(task: Task) {
	upcomingTaskStore.removeTask(task)
}

// event is any since there are no types for sortablejs-vue3
async function handleCardMove(event: any) {
	const oldListIndex = event.from.dataset.listIndex
	const newListIndex = event.to.dataset.listIndex
	const task = props.list.tasks.find(task => task.id === parseInt(event.item.dataset.taskId))

	if ((oldListIndex !== newListIndex) && task) {
		await upcomingTaskStore.updateDate(task, oldListIndex, newListIndex)
		event.item.remove()
	}
}

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
	}
})
</script>

<style lang="scss" scoped>
.upcoming-list {
	width: 100%;

	.top-section {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		gap: toRem(16);
		border-bottom: 1px solid var(--border);

		button {
			flex-shrink: 0;
		}

		.open-list {
			@include squared-button;

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

		.list-name {
			width: 100%;
			@include regular-semibold;
		}

	}

	.list-contents {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: toRem(16);
		gap: toRem(8);
	}

	.empty-spot {
		display: block;
		width: 100%;
		// height: toRem(16);
	}

	&:last-of-type {
		//margin-bottom: toRem(16);
	}
}
</style>