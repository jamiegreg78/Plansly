<template>
	<button v-if="!isInputActive" @click="openInput">New Task</button>
	<div class="task-card new-task" v-if="isInputActive">
		<input id="newTaskInput" type="text" v-model="inputValue" @blur="closeInput" @keydown.enter="closeInput"
			@keydown.esc="closeInput" />
	</div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'

export interface NewTaskProps {
	listId: number
}
const props = defineProps<NewTaskProps>()

const currentBoardStore = useCurrentBoardStore()

// state
const isInputActive = ref<boolean>(false)
const inputValue = ref<string>('')

async function openInput() {
	isInputActive.value = true
	await nextTick()
	document.getElementById('newTaskInput')?.focus()
}

async function closeInput(event: Event) {
	isInputActive.value = false
	await nextTick()
	document.getElementById('newListInput')?.blur()

	if (inputValue.value.length && (event as KeyboardEvent).key !== 'Escape') {
		currentBoardStore.createNewCard(inputValue.value, props.listId)
	}

	inputValue.value = ''
}
</script>


<style lang="scss">
// TODO: Move this to a mixin
.new-task {
	background: var(--background);

	border: 1px solid var(--border);

	padding: toRem(16);

	border-radius: 8px;

	input {
		width: 100%;
		padding: toRem(8);

		border: none;
		@include body-small;

		&:focus {
			outline: none;
			border-bottom: 2px solid var(--border);
		}
	}
}
</style>