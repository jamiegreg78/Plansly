<template>
	<div class="tag-input-container">
		<label>{{ props.label }}</label>
		<div class="input-with-button"
			:class="{ active: input.trim().length }">
			<input type="text"
				:id="props.label.replace(' ', '')"
				:tabindex="props.tabIndex"
				:required="props.required"
				v-model="input" />
			<button v-if="input.length"
				@click="clearInput">
				<font-awesome-icon icon="fa-solid fa-xmark" />
			</button>
		</div>
		<div class="options-dropdown"
			v-if="input.trim().length"
			:style="dropdownPosition">
			<span class="option"
				:aria-label="`tag option: ${input}`"
				v-if="!partialTagMatches.includes(input)"
				@click="selectTag(input)">
				{{ input }}
			</span>
			<span class="option"
				:aria-label="`tag option: ${tag}`"
				v-for="tag, index in partialTagMatches"
				@click="selectTag(tag)"
				:key="index">{{ tag }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
export interface TagInputProps {
	label: string
	required?: boolean
	tabIndex?: number
	existingTags?: Array<string>
	taskTags?: Array<string>
}

const props = defineProps<TagInputProps>()
const emit = defineEmits(['selectedTag'])

const input = ref<string>('')
const dropdownPosition = ref({})

// Contains the possible options, including tags used before that aren't on the current task that partially match
const partialTagMatches = computed(() => {
	let array: Array<string> = []

	props.existingTags?.forEach(tag => {
		if (tag.toLocaleLowerCase().includes(input.value.toLowerCase().trim()) && !props.taskTags?.includes(tag.trim())) {
			array.push(tag)
		}
	})

	return array
})

function selectTag(selectedTag: string) {
	if (!props.taskTags?.includes(selectedTag)) {
		emit('selectedTag', selectedTag)
	}
	input.value = ''
}

function clearInput() {
	input.value = ''
}

const resizeListener = () => {
	const input = document.querySelector('.tag-input-container') as HTMLElement
	if (input) {
		dropdownPosition.value = { top: input.getBoundingClientRect().top, left: input.getBoundingClientRect().left, width: `${input.getBoundingClientRect().width}px` }
	}
}

onMounted(() => {
	const input = document.querySelector('.tag-input-container')
	if (input) {
		new ResizeObserver(() => {
			resizeListener()
		}).observe(input)
		const elements = document.getElementsByClassName('overview')

		for (let i = 0; i < elements.length; i++) {
			elements[i].addEventListener('scroll', () => {
				resizeListener()
				console.log('something')
			})
		}
	}
})

onBeforeUnmount(() => {
	const elements = document.getElementsByClassName('overview')

	for (let i = 0; i < elements.length; i++) {
	}
})
</script>

<style lang="scss">
@import '@/scss/inputs.scss';

.tag-input-container {
	margin-bottom: toRem(10);

	label {
		display: block;
		width: 100%;
		margin-bottom: toRem(4);

		@include regular-semibold;
		color: var(--gray);
	}

	.input-with-button {
		display: flex;
		justify-content: space-between;
		overflow: hidden;

		border: 1px solid var(--border);
		border-radius: 8px;

		&.active {
			border-radius: 8px 8px 0 0;
		}

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

	.options-dropdown {
		position: absolute;
		background-color: var(--background);
		border: 1px solid var(--border);

		border-radius: 0 0 8px 8px;
		overflow: hidden;

		.option {
			padding: toRem(8);
			display: block;
			width: 100%;

			&:hover {
				background-color: var(--background-inset);
				cursor: pointer;
			}
		}
	}
}
</style>