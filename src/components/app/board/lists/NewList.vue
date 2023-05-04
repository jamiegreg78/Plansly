<template>
	<div class="list new-list">
		<button v-if="!isInputActive"
			@click="openInput">Create list</button>
		<input :class="{ visible: isInputActive }"
			@blur="closeInput"
			v-model="inputValue"
			id="newListInput"
			@keydown.enter="closeInput"
			@keydown.esc="closeInput"
			type="text" />
	</div>
</template>

<script setup lang="ts">
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import { ref, nextTick } from 'vue'
const currentBoardStore = useCurrentBoardStore()

const isInputActive = ref<boolean>(false)
const inputValue = ref<string>('')

// Opens and focuses the input, using nextTick to ensure the input is rendered first before focus
async function openInput() {
	isInputActive.value = true
	await nextTick()
	document.getElementById('newListInput')?.focus()
}

async function closeInput(event: Event) {
	isInputActive.value = false
	await nextTick()
	document.getElementById('newListInput')?.blur()

	// check if it has a value, if so then create a new list
	if (inputValue.value.length && (event as KeyboardEvent).key !== 'Escape') {
		currentBoardStore.createNewList(inputValue.value)
	}

	inputValue.value = ''
}

</script>

<style lang="scss">
.list.new-list {
	padding: 0;
	width: toRem(350);

	button {
		width: 100%;
		padding: toRem(8);

		background-color: var(--gray-light);

		border-radius: 8px;
		border: none;

		@include regular-semibold;

		&:hover {
			background-color: var(--gray-light-hover);
			cursor: pointer;
		}
	}

	&.new-list {
		input {
			display: none;
			width: 100%;
			padding: toRem(8);

			border: none;
			@include body-small;

			&:focus {
				outline: none;
				border-bottom: 2px solid var(--border);
			}

			&.visible {
				display: block;
			}
		}
	}
}
</style>