<template>
	<button :disabled="props.disabled"
		class="button"
		:class="{ primary: props.isPrimary }"
		@click="emitClick"
		:tabindex="props.tabIndex">
		<span v-if="props.inProgress"
			class="spinner"></span>
		<span v-else>{{ props.text }}</span>
	</button>
</template>

<script setup lang="ts">
export type ButtonProps = {
	text: string
	isPrimary?: boolean
	disabled?: boolean
	tabIndex?: number
	inProgress?: boolean
}
const props = defineProps<ButtonProps>()

const emit = defineEmits(['clicked'])

function emitClick(event: Event) {
	emit('clicked', event)
}
</script>

<style lang="scss">
.button {
	@include button;

	.spinner {
		margin: auto;
		display: block;
		width: 1.5rem;
		height: 1.5rem;
		border: 0.2rem solid var(--white);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;

		@keyframes spin {
			from {
				transform: rotate(0deg);
			}

			to {
				transform: rotate(360deg);
			}
		}
	}
}
</style>
