<template>
	<div class="list">
		<div class="top-section">
			<input @blur="closeInput" v-model="newTitle" @keydown.enter="closeInput" @keydown.esc="closeInput" type="text"
				:placeholder="props.list.name" />
			<button class="new-task-button">
				<font-awesome-icon icon="fa-solid fa-plus" />
			</button>
			<button class="options-button">
				<font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
			</button>
		</div>
		<div class="list-contents">
			<TaskCard v-for="item, index in props.list.tasks" :key="index" :task="item" />
			<NewTask :list-id="props.list.id" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { List } from '@/types/DatabaseTypes'
import NewTask from '@/components/app/board/tasks/NewTask.vue'
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import { ref, nextTick } from 'vue'
import TaskCard from '../tasks/TaskCard.vue'

export interface TaskListProps {
	list: List
}
const props = defineProps<TaskListProps>()
const currentBoardStore = useCurrentBoardStore()

const newTitle = ref<string>('')

async function closeInput(event: Event) {
	await nextTick()
	document.getElementById('newListInput')?.blur()

	// check if it has a value, if so then create a new list
	if (newTitle.value.length && (event as KeyboardEvent).key !== 'Escape') {
		console.log('asda')
	}

	newTitle.value = ''
}
</script>

<style lang="scss">
.list {
	// TODO: MAKE THIS A MIXIN
	width: toRem(300);

	padding: 0 toRem(10);

	.top-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: toRem(4);

		input {
			width: 100%;
			border: none;
			width: 100%;
			padding: toRem(8);

			border: none;
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

	.list-contents {
		padding: toRem(10) 0;
		display: flex;
		flex-direction: column;
		gap: toRem(10);
	}

}
</style>