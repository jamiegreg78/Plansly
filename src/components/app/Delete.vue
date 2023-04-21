<template>
	<div class="modal-container"
		@click="$emit('cancel')">
		<div class="delete-modal"
			@click.stop>
			<p>Are you sure you wish to delete this {{ mode }}?</p>
			<ButtonComponent class="delete-button"
				text="Delete"
				@clicked="$emit('confirm')" />
			<ButtonComponent text="Cancel"
				@clicked="$emit('cancel')" />
		</div>
	</div>
</template>

<script setup lang="ts">
import ButtonComponent from '../general/ButtonComponent.vue';

export interface DeleteProps {
	mode: 'board' | 'module'
	id: number
}
const props = defineProps<DeleteProps>()

const emit = defineEmits(['cancel', 'confirm'])
</script>

<style lang="scss">
.modal-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100;
	display: flex;
	padding: toRem(16);
	justify-content: center;
	align-items: center;

	.delete-modal {
		padding: toRem(16);
		border: 1px solid var(--var);
		border-radius: 8px;

		background-color: var(--background);
		@include drop-shadow;

		button:not(:last-child) {
			margin-bottom: toRem(8);
		}

		.delete-button {
			background-color: var(--red);
			border-color: var(--red);
			color: var(--white);

			&:hover {
				background-color: var(--red-hover);
				border-color: var(--red-hover);
			}
		}
	}
}
</style>