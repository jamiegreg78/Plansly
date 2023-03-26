<template>
	<div class="text-input-container"
		:class="props.containerClass">
		<label :for="props.label"
			v-if="props.showLabel">
			{{ props.label }}
		</label>
		<div class="input-wrapper"
			v-if="!props.multiLine"
			:class="{ focus: isFocused, error: props.hasError }">
			<input :type="type"
				:value="modelValue"
				:tabindex="props.tabIndex"
				:id="props.label.replace(' ', '')"
				:required="props.required"
				:placeholder="props.placeholder"
				@focus="() => {
					isFocused = true
					$emit('focus')
				}"
				@blur="() => {
					isFocused = false
					$emit('blur')
				}"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
			<button class="clear-button"
				type="button"
				v-if="props.clearButton && props.modelValue.length"
				@click.prevent="$emit('update:modelValue', '')"
				@keydown.enter.prevent="() => { return null }"
				tabindex="0">
				<font-awesome-icon icon="fa-solid fa-xmark" />
			</button>
		</div>
		<div v-else
			class="input-wrapper">
			<textarea :value="modelValue"
				@blur="$emit('blur')"
				:class="{ error: props.hasError }"
				:tabindex="props.tabIndex"
				:placeholder="props.placeholder"
				:id="props.label.replace(' ', '')"
				:required="props.required"
				@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />

		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export type TextInputProps = {
	containerClass?: string
	label: string
	type: 'email' | 'password' | 'text'
	modelValue: string
	hasError?: boolean
	required?: boolean
	multiLine?: boolean
	tabIndex?: number
	clearButton?: boolean
	showLabel?: boolean
	placeholder?: string
}

const props = defineProps<TextInputProps>()
const isFocused = ref<boolean>(false)

defineEmits(['update:modelValue', 'blur', 'focus'])
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

	.input-wrapper {
		display: flex;
		@include text-input;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0;
		overflow: hidden;

		input,
		textarea {
			resize: none;
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

	input,
	textarea {
		// @include text-input;
		resize: none;
	}
}
</style>
