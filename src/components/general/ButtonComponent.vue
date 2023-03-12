<template>
	<button :disabled="props.disabled" class="button" :class="{ primary: props.isPrimary }" @click="emitClick">
		{{ props.text }}
	</button>
</template>

<script setup lang="ts">
export type ButtonProps = {
	text: string
	isPrimary?: boolean
	disabled?: boolean
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
}
</style>
