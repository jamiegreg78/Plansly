<template>
	<form class="new-board-form" id="newBoardForm">
		<button class="close-button" @click.prevent="$emit('close')">
			<font-awesome-icon icon="fa-solid fa-xmark" />
		</button>
		<TextInput label="Title" type="text" v-model="title" required />
		<TextInput label="Description" type="text" v-model="description" :multi-line="true" />
		<ColorPicker @color-chosen="(newColor) => chosenColor = newColor" />
		<ButtonComponent text="Create" :is-primary="true" @clicked="submitNewBoard" />
	</form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserDataStore } from '@/stores/UserDataStore'
import ButtonComponent from '@/components/general/ButtonComponent.vue'
import ColorPicker from '@/components/general/ColorPicker.vue'
import TextInput from '../inputs/TextInput.vue'
import type { ColorPickerOptions } from '@/types/ColorPicker'
import { useRouter } from 'vue-router'
const userData = useUserDataStore()
const router = useRouter()

const title = ref<string>('')
const description = ref<string>('')
const chosenColor = ref<ColorPickerOptions | null>({})

onMounted(() => {
	window.scrollTo(0, 0)
})

async function submitNewBoard(event: Event) {
	const form: HTMLFormElement = document.getElementById('newBoardForm') as HTMLFormElement
	const currentModuleIndex: number = userData.getModuleIndex(parseInt(router.currentRoute.value.params.moduleId as string))

	if (form.checkValidity()) {
		event.preventDefault()
		await userData.createNewBoardForModule(title.value, description.value, chosenColor.value, currentModuleIndex)
		emit('close')
	}
}

const emit = defineEmits(['close'])
</script>

<style lang="scss">
.new-board-form {
	width: 100%;

	.close-button {
		@include squared-button;
	}

	input {
		width: 100%;
	}
}
</style>