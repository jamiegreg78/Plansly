<template>
	<div class="list-overview-container"
		@click="closeOverview">
		<div class="overview"
			@click.stop>
			<div class="top-section">
				<input class="list-name"
					id="newNameInput"
					type="text"
					v-model="name"
					tabindex="0" />
				<button class="close-button"
					@click="closeOverview"
					tabindex="2">
					<font-awesome-icon icon="fa-solid fa-xmark" />
				</button>
			</div>
			<div class="details">
				<TextInput v-model="description"
					:show-label="true"
					label="Description"
					type="text"
					multi-line
					:tab-index="0" />
				<NumberInput label="Work in progress limit"
					v-model="workInProgressLimit"
					:min-value="1"
					:max-value="10"
					:tab-index="0" />
			</div>
			<div class="delete-container">
				<div class="options">
					<button class="delete-button"
						@click="deleteMenuIsOpen = true"
						tabindex="0">
						Delete
					</button>
					<span v-if="deleteMenuIsOpen">Are you sure?</span>
					<button class="confirm"
						v-if="deleteMenuIsOpen"
						@click="deleteList"
						tabindex="0">
						<font-awesome-icon icon="fa-solid fa-check" />
					</button>
					<button class="cancel"
						v-if="deleteMenuIsOpen"
						@click="deleteMenuIsOpen = false"
						tabindex="0">
						<font-awesome-icon icon="fa-solid fa-xmark" />
					</button>
				</div>
			</div>
			<ButtonComponent :is-primary="true"
				text="Save changes"
				@clicked="saveChanges"
				:disabled="apiRequestInProgress"
				:in-progress="apiRequestInProgress"
				:tab-index="0" />
		</div>
	</div>
</template>

<script setup lang="ts">
import ButtonComponent from '@/components/general/ButtonComponent.vue'
import NumberInput from '@/components/inputs/NumberInput.vue'
import TextInput from '@/components/inputs/TextInput.vue'
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import { ref, onBeforeMount } from 'vue'

const currentBoardStore = useCurrentBoardStore()
const deleteMenuIsOpen = ref<boolean>(false)
const apiRequestInProgress = ref<boolean>(false)

const name = ref<string>('')
const description = ref<string>('')
const workInProgressLimit = ref<number | null>(null)

function closeOverview() {
	currentBoardStore.setCurrentListOverview(undefined)
}

async function deleteList() {
	deleteMenuIsOpen.value = false
	await currentBoardStore.deleteList(currentBoardStore.currentListOverview!)
	currentBoardStore.setCurrentListOverview(undefined)
}

async function saveChanges() {
	apiRequestInProgress.value = true
	await currentBoardStore.changeListDetails({
		name: name.value,
		description: description.value,
		work_in_progress_limit: workInProgressLimit.value
	})

	closeOverview()
}

onBeforeMount(() => {
	name.value = currentBoardStore.currentListOverview!.name
	// Populate the description - either empty if there isn't one, or the actual value
	if (currentBoardStore.currentListOverview?.description) {
		description.value = currentBoardStore.currentListOverview.description
	}

	if (currentBoardStore.currentListOverview?.work_in_progress_limit) {
		workInProgressLimit.value = currentBoardStore!.currentListOverview!.work_in_progress_limit
	} else {
		workInProgressLimit.value = null
	}
})
</script>

<style lang="scss">
.list-overview-container {
	@include modal-form;
}
</style>