<template>
	<div class="select-input-container"
		:class="props.containerClass">
		<div class="input-wrapper">
			<select :value="props.modelValue"
				placeholder="props.placeholder"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
				<option v-for="option in props.options"
					:value="option.value">
					{{ option.name }}
				</option>
			</select>
			<button class="clear-button"
				type="button"
				v-if="props.clearButton && props.modelValue !== props.options[0].value"
				@click.prevent="$emit('update:modelValue', props.options[0].value)"
				@keydown.enter.prevent="() => { return null }"
				tabindex="0">
				<font-awesome-icon icon="fa-solid fa-xmark" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
// Another component that was scrapped in favor of a different solution
// Kept just in case it's needed in the future after refactoring
import type { SelectOption } from '@/types/SelectInputTypes'
export type SelectInputProps = {
	containerClass?: string
	label: string
	modelValue: string
	options: SelectOption[]
	hasError?: boolean
	required?: boolean
	clearButton?: boolean
	placeholder?: string
}

const props = defineProps<SelectInputProps>()
</script>

<style lang="scss">
@import '@/scss/inputs.scss';

.select-input-container {
	width: 100%;
	margin-bottom: toRem(10);

	.input-wrapper {
		display: flex;
		@include text-input;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0;
		overflow: hidden;

		select {
			@include text-input;
			width: 100%;
			border: none;
			border-radius: 0;

			&:focus {
				outline: none;
				border: none;
			}
		}
	}
}
</style>