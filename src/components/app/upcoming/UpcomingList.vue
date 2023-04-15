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
			v-if="listIsOpen"
			tag="div"
			@end="handleCardMove"
			:list="props.list.tasks"
			itemKey="id"
			:options="listOptions">
			<template #item="{ element }">
				<ListTaskCard :task="element"
					:key="element.id"
					isUpcoming />
			</template>
		</Sortable>
	</div>
</template>

<script setup lang="ts">
import type { UpcomingList } from '@/types/DatabaseTypes';
import ListTaskCard from '@/components/app/list_board/tasks/ListTaskCard.vue'
import { Sortable } from 'sortablejs-vue3';
import { computed, ref } from 'vue';

export interface UpcomingListProps {
	list: UpcomingList
}
const props = defineProps<UpcomingListProps>()

const listIsOpen = ref<boolean>(true)

// event is any since there are no types for sortablejs-vue3
function handleCardMove(event: any) {
	const oldIndex = event.oldIndex
	const newIndex = event.newIndex
	console.log(event)

	if (oldIndex === newIndex) {
		return
	} else {
		console.log('moved')
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

<style lang="scss">
.upcoming-list {
	width: 100%;

	.top-section {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		gap: toRem(16);

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


	&:last-of-type {
		margin-bottom: toRem(16);
	}
}
</style>