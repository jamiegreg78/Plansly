<template>
	<section class="overview-view"
		v-if="currentBoardStore.currentBoard">
		<BoardInformation />
		<div class="board-content">
			<TextInput label="Board Name"
				type="text"
				show-label
				v-model="boardName" />
			<TextInput label="Board Description"
				type="text"
				show-label
				v-model="boardDescription"
				multi-line />

			<ColorPicker :default-color="currentBoardStore.currentBoard.color"
				@color-chosen="chosenColor = $event" />
			<ButtonComponent text="Save Changes"
				@click="updateBoard"
				is-primary
				:in-progress="apiRequestInProgress"
				:disabled="apiRequestInProgress"
				:tab-index="0" />
		</div>
	</section>
	<LoadingSpinner v-else />
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore';
import { AppRoutes } from '@/router/RouteNames';
import { useRouter } from 'vue-router';
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import ButtonComponent from '@/components/general/ButtonComponent.vue';
import ColorPicker from '@/components/general/ColorPicker.vue';
import type { ColorPickerOptions } from '@/types/ColorPicker';
import BoardInformation from '@/components/app/BoardInformation.vue';

const router = useRouter()
const currentBoardStore = useCurrentBoardStore()

const apiRequestInProgress = ref<boolean>(false)
const boardName = ref<string>('')
const boardDescription = ref<string>('')
const chosenColor = ref<ColorPickerOptions | null>(null)

// Either redirects the user to the not found page or loads the current board and sets the state
onBeforeMount(async () => {
	const results = await currentBoardStore.loadCurrentBoard()
	if (results?.data.length === 0) {
		router.push(AppRoutes.notFound)
	} else {
		boardName.value = results?.data[0].name!
		boardDescription.value = results?.data[0].description || ''
		chosenColor.value = results?.data[0].color || null
	}
})

// Updates the board with the new information
async function updateBoard() {
	apiRequestInProgress.value = true
	await currentBoardStore.changeBoardDetails({
		name: boardName.value,
		description: boardDescription.value,
		color: chosenColor.value
	})
	apiRequestInProgress.value = false
	router.push(AppRoutes.board.replace(':moduleId', currentBoardStore.currentBoard!.module.toString()).replace(':boardId', currentBoardStore.currentBoard!.id.toString()))
}

</script>

<style lang="scss">
section.overview-view {
	display: flex;
	flex-direction: column;

	.board-content {
		padding: toRem(16);

		textarea {
			resize: vertical;
		}
	}
}
</style>
