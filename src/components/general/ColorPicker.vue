<template>
	<div class="color-picker-container">
		<label>Color</label>
		<div class="option-list">
			<span class="color-option" v-for="(item, index) in ColorArray" :key="index"
				:class="{ chosen: chosenColor?.name === item.name }" :style="{ 'background-color': item.hexValue }"
				@click.prevent="chooseColor(item)">
				<font-awesome-icon icon="fa-solid fa-check" v-if="chosenColor?.name === item.name" />
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ColorArray } from '@/types/ColorPicker'
import { ref } from 'vue'
import type { ColorPickerOptions } from '@/types/ColorPicker'

const chosenColor = ref<ColorPickerOptions | null>(null)

const emit = defineEmits(['color-chosen'])

function chooseColor(color: ColorPickerOptions) {
	// if clicking on the same color, remove it. Otherwise, select it and emit.
	if (chosenColor.value?.name && chosenColor.value.name === color.name) {
		chosenColor.value = null
	} else {
		chosenColor.value = color
	}

	emit('color-chosen', chosenColor.value)
}
</script>

<style lang="scss">
.color-picker-container {
	label {
		margin-bottom: toRem(4);
		@include regular-semibold;
		color: var(--gray);
	}
}

.option-list {
	display: flex;
	gap: toRem(10);
	margin-bottom: toRem(10);

	.color-option {
		display: flex;
		justify-content: center;
		align-items: center;
		width: toRem(40);
		height: toRem(40);
		border-radius: 8px;
		color: var(--white);

		font-size: toRem(24);

		@include drop-shadow;

		&:hover {
			cursor: pointer;
		}
	}

}
</style>