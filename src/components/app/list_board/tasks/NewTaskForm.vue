<template>
	<div class="new-task-container"
		@click="$emit('close-modal')">
		<div class="new-task modal"
			@click.stop>
			<div class="top-section">
				<h1>Create Task</h1>
				<button class="close-button"
					tabindex="2"
					@click="$emit('close-modal')">
					<font-awesome-icon icon="fa-solid fa-xmark" />
				</button>
			</div>
			<form id="newTaskForm"
				@submit="closeModal">
				<TextInput v-model="newName"
					show-label
					label="Task Name"
					type="text"
					required />
				<ButtonComponent text="Create Task"
					type="submit"
					:tab-index="0"
					is-primary />
			</form>
		</div>
	</div>
</template>


<script setup lang="ts">
import ButtonComponent from '@/components/general/ButtonComponent.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import { ref } from 'vue';
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore';

export interface NewTaskFormProps {
	listIndex: number
}
const props = defineProps<NewTaskFormProps>()

const currentBoardStore = useCurrentBoardStore()
const newName = ref<string>('')

async function closeModal(event: Event) {
	const form = document.getElementById('newTaskForm') as HTMLFormElement
	if (form.checkValidity()) {
		event.preventDefault()
		await currentBoardStore.createNewCard(newName.value, props.listIndex)
		emit('close-modal')
	}
}
const emit = defineEmits(['close-modal'])
</script>

<style lang="scss">
.new-task-container {
	@include modal-form;

	.top-section {
		justify-content: space-between;

		h1 {
			@include body-large;
			margin: 0;
		}
	}
}
</style>