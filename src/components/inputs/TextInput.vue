<template>
	<div class="text-input-container">
		<label :for="props.label">{{ props.label }}</label>
		<input :type="type" :value="modelValue" :class="{ error: props.hasError }" :id="props.label.replace(' ', '')"
			:required="props.required" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
	</div>
</template>

<script setup lang="ts">
export type TextInputProps = {
	label: string
	type: 'email' | 'password'
	modelValue: string
	hasError?: boolean
	required?: boolean
}

const props = defineProps<TextInputProps>()

defineEmits(['update:modelValue'])
</script>

<style lang="scss">
@import '@/scss/inputs.scss';

.text-input-container {
	width: 100%;
	margin-bottom: toRem(10);

	label {
		display: block;
		margin-bottom: toRem(4);

		@include regular-semibold;
		color: var(--gray);
	}

	input {
		@include text-input;
	}
}
</style>
