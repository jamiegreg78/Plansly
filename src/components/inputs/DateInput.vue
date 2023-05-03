<template>
	<div class="date-input-container">
		<label>{{ props.label }}</label>
		<div class="date-input">
			<input type="datetime-local"
				:min="props.minValue"
				:max="props.maxValue"
				:id="props.label.replace(' ', '')"
				:tabindex="props.tabIndex"
				@blur="$emit('blur')"
				:required="props.required"
				:value="modelValue"
				:aria-label="props.label"
				@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
				@keydown.prevent>
			<button v-if="modelValue.length"
				@click="clearInput">
				<font-awesome-icon icon="fa-solid fa-xmark" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">

export interface DateInputProps {
	label: string
	modelValue: string
	required?: boolean
	minValue?: string
	maxValue?: string
	tabIndex?: number
}

const props = defineProps<DateInputProps>()
const emit = defineEmits(['blur', 'update:modelValue'])

function clearInput() {
	emit('update:modelValue', '')
}
</script>

<style lang="scss">
@import '@/scss/inputs.scss';

.date-input-container {
	margin-bottom: toRem(10);

	label {
		display: block;
		width: 100%;
		margin-bottom: toRem(4);

		@include regular-semibold;
		color: var(--gray);
	}

	.date-input {
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