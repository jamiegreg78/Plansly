<template>
	<form class="new-module-form"
		id="newModuleForm">
		<button class="close-button"
			@click.prevent="$emit('close')">
			<font-awesome-icon icon="fa-solid fa-xmark" />
		</button>
		<TextInput :show-label="true"
			label="Title"
			type="text"
			v-model="title"
			required />
		<TextInput :show-label="true"
			label="Description"
			type="text"
			v-model="description"
			:multi-line="true" />
		<ButtonComponent text="Create"
			:is-primary="true"
			@clicked="submitNewModule" />
	</form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserDataStore } from '@/stores/UserDataStore'
import ButtonComponent from '../general/ButtonComponent.vue'
import TextInput from '../inputs/TextInput.vue'
const userData = useUserDataStore()

const title = ref<string>('')
const description = ref<string>('')

onMounted(() => {
	window.scrollTo(0, 0)
})

async function submitNewModule(event: Event) {
	const form: HTMLFormElement = document.getElementById('newModuleForm') as HTMLFormElement

	if (form.checkValidity()) {
		event.preventDefault()
		await userData.createNewModule(title.value, description.value)
		emit('close')
	}
}

const emit = defineEmits(['close'])
</script>

<style lang="scss">
.new-module-form {
	width: 100%;

	.close-button {
		@include squared-button;
	}

	input {
		width: 100%;
	}
}
</style>