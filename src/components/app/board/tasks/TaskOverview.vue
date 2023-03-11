<template>
	<div class="task-overview-container" @click="closeOverview">
		<div class="task-overview" @click.stop>
			<div class="top-section">
				<input class="task-name" id="newNameInput" type="text" v-model="name" @blur.stop="submitNewName" />
				<button class="close-button" @click="closeOverview">
					<font-awesome-icon icon="fa-solid fa-xmark" />
				</button>
			</div>
			<div class="task-details">
				<TextInput v-model="description" label="Description" type="text" multi-line @blur="submitNewDescription" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import TextInput from '@/components/inputs/TextInput.vue'
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import { ref, onBeforeMount } from 'vue'
const currentBoardStore = useCurrentBoardStore()

const name = ref<string>('')
const description = ref<string>('')

function closeOverview() {
	currentBoardStore.setCurrentTaskOverview(undefined)
}

async function submitNewName() {
	const initialName = currentBoardStore.currentTaskOverview?.name

	if (name.value.length && name.value !== initialName) {
		await currentBoardStore.changeTaskName(name.value)
	} else {
		name.value = initialName!
	}

	name.value = currentBoardStore.currentTaskOverview?.name!
}

async function submitNewDescription() {
	const initialDescription = currentBoardStore.currentTaskOverview?.description

	console.log(description.value)
	if (description.value.length && description.value !== initialDescription) {
		await currentBoardStore.changeTaskDescription(description.value)
	} else {
		description.value = initialDescription!
	}

	name.value = currentBoardStore.currentTaskOverview?.name!

}

onBeforeMount(() => {
	name.value = currentBoardStore.currentTaskOverview!.name
	// Populate the description - either empty if there isn't one, or the actual value
	if (currentBoardStore.currentTaskOverview?.description) {
		description.value = currentBoardStore.currentTaskOverview.description
	}
})

</script>

<style lang="scss">
.task-overview-container {
	height: 100%;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;

	backdrop-filter: blur(2px);
	background-color: rgba(#000000, 0.25);

	display: flex;
	justify-content: center;
	align-items: center;


	.task-overview {
		padding: toRem(16);
		background-color: var(--background);

		border: 1px solid var(--border);
		border-radius: 8px;

		.top-section {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.close-button {
				border: none;
				background: transparent;

				@include body-large;

				&:hover {
					cursor: pointer;
				}
			}

			.task-name {
				margin: 0;
				@include body-large;
			}
		}

		.task-details {

			textarea {
				resize: vertical;
				max-height: toRem(200);
			}
		}

		@include breakpoint(tablet) {
			min-width: toRem(300);
		}

		@include breakpoint(desktop) {
			min-width: toRem(450);
		}
	}
}
</style>