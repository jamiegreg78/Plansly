<template>
	<div class="number-input-container">
		<label>{{ props.label }}</label>
		<div class="input-with-button">
			<input type="number"
				:min="props.minValue"
				:max="props.maxValue"
				:id="props.label.replace(' ', '')"
				:tabindex="props.tabIndex"
				@blur="$emit('blur')"
				:required="props.required"
				:value="modelValue"
				@input="handleInput(($event.target as HTMLInputElement).value)"
				:aria-label="props.label" />
			<button v-if="modelValue"
				@click="clearInput">
				<font-awesome-icon icon="fa-solid fa-xmark" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'

export interface NumberInputProps {
	label: string
	modelValue: number | null
	required?: boolean
	minValue?: number
	maxValue?: number
	tabIndex?: number
}

const props = defineProps<NumberInputProps>()
const emit = defineEmits(['blur', 'update:modelValue'])
const instance = getCurrentInstance()

// Ensures that the input value is within the upper/lower limits
// Also prevents non-numeric characters from being entered
function handleInput(newValue: string | undefined) {
	// If there are upper/lower limits, handle them
	if (typeof newValue !== 'undefined') {
		if (props.minValue) {
			if (parseInt(newValue) < props.minValue) {
				emit('update:modelValue', props.minValue)
				instance?.proxy?.$forceUpdate()
				return
			}
		}
		if (props.maxValue) {
			if (parseInt(newValue) > props.maxValue) {
				emit('update:modelValue', props.maxValue)
				instance?.proxy?.$forceUpdate()
				return
			}
		}
		emit('update:modelValue', parseInt(newValue))
		instance?.proxy?.$forceUpdate()
		return
	} else {
		emit('update:modelValue', null)
		instance?.proxy?.$forceUpdate()
		return
	}
}

function clearInput() {
	emit('update:modelValue', null)
}
</script>

<style lang="scss">
@import '@/scss/inputs.scss';

.number-input-container {
	margin-bottom: toRem(10);

	label {
		display: block;
		width: 100%;
		margin-bottom: toRem(4);

		@include regular-semibold;
		color: var(--gray);
	}

	.input-with-button {
		max-width: toRem(150);
		display: flex;
		justify-content: space-between;
		overflow: hidden;

		border: 1px solid var(--border);
		border-radius: 8px;

		input {
			@include number-input;
			width: 100%;

			&:focus {
				outline: none;
			}
		}

		button {
			display: block;
			padding: 0 toRem(16);
			border: none;
			border-left: 1px solid transparent;
			border-radius: 0;
			background-color: transparent;

			@include regular-semibold;
			font-size: toRem(20);

			&:hover {
				border: none;
				border-left: 1px solid var(--border);
				background-color: var(--background-inset);
			}
		}
	}
}
</style>