<template>
	<div class="list-overview-container" @click="closeOverview">
		<div class="list-overview" @click.stop>
			<div class="top-section">
				<input class="list-name" id="newNameInput" type="text" v-model="name" @blur.stop="submitNewName" />
				<button class="close-button" @click="closeOverview">
					<font-awesome-icon icon="fa-solid fa-xmark" />
				</button>
			</div>
			<div class="list-details">
				<TextInput v-model="description" label="Description" type="text" multi-line @blur="submitNewDescription" />
			</div>
			<div class="delete-container">
				<div class="options">
					<button class="delete-button" @click="deleteMenuIsOpen = true">
						Delete
					</button>
					<span v-if="deleteMenuIsOpen">Are you sure?</span>
					<button class="confirm" v-if="deleteMenuIsOpen" @click="deleteList">
						<font-awesome-icon icon="fa-solid fa-check" />
					</button>
					<button class="cancel" v-if="deleteMenuIsOpen" @click="deleteMenuIsOpen = false">
						<font-awesome-icon icon="fa-solid fa-xmark" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import TextInput from '@/components/inputs/TextInput.vue'
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import { ref, onBeforeMount } from 'vue'
const currentBoardStore = useCurrentBoardStore()
const deleteMenuIsOpen = ref<boolean>(false)

const name = ref<string>('')
const description = ref<string>('')

function closeOverview() {
	currentBoardStore.setCurrentListOverview(undefined)
}

async function submitNewName() {
	const initialName = currentBoardStore.currentListOverview?.name

	if (name.value.length && name.value !== initialName) {
		await currentBoardStore.changeListName(name.value)
	} else {
		name.value = initialName!
	}

	name.value = currentBoardStore.currentListOverview?.name!
}

async function submitNewDescription() {
	const initialDescription = currentBoardStore.currentListOverview?.description

	if (description.value !== initialDescription) {
		await currentBoardStore.changeListDescription(description.value)
	} else {
		description.value = initialDescription!
	}

	name.value = currentBoardStore.currentListOverview?.name!

}

async function deleteList() {
	deleteMenuIsOpen.value = false
	await currentBoardStore.deleteList(currentBoardStore.currentListOverview!)
	currentBoardStore.setCurrentListOverview(undefined)
}

onBeforeMount(() => {
	name.value = currentBoardStore.currentListOverview!.name
	// Populate the description - either empty if there isn't one, or the actual value
	if (currentBoardStore.currentListOverview?.description) {
		description.value = currentBoardStore.currentListOverview.description
	}
})

</script>

<style lang="scss">
.list-overview-container {
	height: 100%;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 5;

	backdrop-filter: blur(2px);
	background-color: rgba(#000000, 0.25);

	display: flex;
	justify-content: center;
	align-items: center;


	.list-overview {
		max-width: 100%;
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

			.list-name {
				margin: 0;
				@include body-large;

				border: none;
				border-bottom: 2px solid transparent;

				&:focus {
					outline: none;
					border-bottom-color: var(--border);
				}
			}
		}

		.list-details {
			textarea {
				resize: vertical;
				max-height: toRem(200);
			}

			.complete-status {
				width: fit-content;
				display: block;
				padding: toRem(8);

				border: 1px solid var(--border);
				border-radius: 8px;

				@include regular-semibold;

				&.complete {
					color: var(--green);
					border-color: var(--green);
				}

				&:hover {
					cursor: pointer;
				}
			}
		}

		.delete-container {
			@include body-small;

			.options {
				display: flex;
				align-items: center;
				gap: toRem(8);

				.delete-button {
					width: fit-content;
					display: block;
					padding: toRem(8);
					@include regular-semibold;

					background-color: var(--error-background);
					color: var(--error);
					border: 1px solid var(--error);
					border-radius: 8px;


				}

				button:not(.delete-button) {
					@include squared-button;
				}
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