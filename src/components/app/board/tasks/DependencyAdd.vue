<template>
	<button class="add-dependency-toggle"
		v-if="!formVisible"
		@click="formVisible = true">
		Add Dependency
		<font-awesome-icon icon="fa-solid fa-plus" />
	</button>
	<div class="dependency-container"
		v-if="formVisible">
		<button class="mode-toggle"
			:class="mode"
			tabindex="0"
			@click="toggleMode">
			{{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
			<font-awesome-icon icon="fa-solid fa-right-left" />
		</button>
		<TextInput type="text"
			label="Dependency Search"
			container-class="dependency-search-container"
			placeholder="Search for a task"
			clear-button
			:tab-index="0"
			v-model="search" />
		<div class="results-container"
			:style="searchDropdownPosition"
			v-if="taskOptions.length">
			<span class="result"
				@click="$event => {
					selectDependency(item)
					search = ''
				}"
				v-for="item in taskOptions">
				{{ item.name }}
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
// TODO: Fix the already added ones appearing in search afterwards

import TextInput from '@/components/inputs/TextInput.vue';
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore';
import type { Task } from '@/types/DatabaseTypes';
import Fuse from 'fuse.js';
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

export interface DependencyAddProps {
	currentDependencies: Task[]
}
const props = defineProps<DependencyAddProps>()

const formVisible = ref<boolean>(false)
const currentBoardStore = useCurrentBoardStore()
const search = ref<string>('')
const taskOptions = ref<Task[]>([])
const mode = ref<'blocked' | 'blocking'>('blocking')
let fuse: any | null = null

const emit = defineEmits(['addDependency', 'update:modelValue'])

function toggleMode() {
	mode.value = mode.value === 'blocking' ? 'blocked' : 'blocking'
}

function selectDependency(chosenTask: Task) {
	const newDependency = {
		blocked_task: mode.value === 'blocking' ? chosenTask.id : currentBoardStore.currentTaskOverview?.id,
		blocking_task: mode.value === 'blocking' ? currentBoardStore.currentTaskOverview?.id : chosenTask.id,
		information: {
			id: chosenTask.id,
			name: chosenTask.name,
			description: chosenTask.description,
		}
	}
	emit('addDependency', newDependency)
}

const searchDropdownPosition = computed(() => {
	// TODO: Calculate this again 
	const search: HTMLElement | null = document.getElementById('DependencySearch')
	if (search) {
		return {
			top: `${search.getBoundingClientRect().bottom - 2}px`,
			left: `${search.getBoundingClientRect().left}px`,
			width: `${search.getBoundingClientRect().width}px`
		}
	}
	return {}
})

watch(search, async () => {
	if (fuse) {
		const results = fuse.search(search.value)

		let foundTasks: Task[] = []
		results.forEach((foundItem: any) => {
			foundItem.matches.forEach((match: any) => {
				let task: Task = currentBoardStore.currentBoard?.lists[foundItem.refIndex].tasks?.[match.refIndex] as Task
				// Don't add if the task is already in the array
				// Also don't add if the found task is the task we're adding the dependency to
				if (!foundTasks.includes(task) && task.id !== currentBoardStore.currentTaskOverview?.id) {
					const alreadyBlocked = currentBoardStore.currentTaskOverview?.blocked.findIndex((item) => item.information.id === task.id) !== -1
					const alreadyBlocking = currentBoardStore.currentTaskOverview?.blocking.findIndex((item) => item.information.id === task.id) !== -1
					const alreadyInDependencies = props.currentDependencies.findIndex((item) => item.blocking_task === task.id || item.blocked_task === task.id) !== -1

					// Finally don't add it if the task is already a dependency
					if (!alreadyBlocked && !alreadyBlocking && !alreadyInDependencies) {
						foundTasks.push(currentBoardStore.currentBoard?.lists[foundItem.refIndex].tasks?.[match.refIndex] as Task)
					}
				}
			})
		})

		taskOptions.value = foundTasks
	}
})

// casted to any because of a ts error
watch(currentBoardStore.currentBoard as any, () => {
	initialiseFuse()
})

function initialiseFuse() {
	fuse = new Fuse(currentBoardStore.currentBoard?.lists as any, {
		keys: [
			'tasks.name', 'tasks.description'
		],
		findAllMatches: true,
		useExtendedSearch: true,
		includeMatches: true,
	})
}


onMounted(() => {
	initialiseFuse()
})
</script>


<style lang="scss" scoped>
.add-dependency-toggle {
	@include body-small;
	background-color: transparent;
	border: none;
	border-radius: 8px;
	padding: toRem(8);
	color: var(--text);
	transition: background-color 0.2s ease;
	display: flex;
	align-items: center;
	gap: toRem(8);

	&:hover {
		background-color: var(--background-inset);
	}
}

.dependency-container {
	display: flex;
	gap: toRem(4);
	height: toRem(40);
	align-items: center;


	.dependency-search-container {
		margin: 0;
	}

	.mode-toggle {
		background-color: transparent;
		border: none;
		border-radius: 8px;
		flex-shrink: 0;
		width: toRem(110);
		@include body-small;
		height: 100%;

		svg {
			margin-left: 8px;
		}

		&.blocking {
			color: var(--error);
		}

		&.blocked {
			color: var(--orange);
		}

		&:hover {
			background-color: var(--background-inset);
		}
	}

	.results-container {
		position: absolute;
		z-index: 5;
		background-color: var(--background);
		border-radius: 0 0 8px 8px;
		outline: 2px solid var(--primary);
		overflow: hidden;

		.result {
			display: flex;
			padding: toRem(8);
			justify-content: space-between;
			align-items: center;

			@include body-small;

			.task-info {
				display: block;
				flex-grow: 0;
				width: 80%;

				span {
					display: block;
				}

				.description {
					width: 100%;
					color: var(--text-subtext);
					font-size: toRem(14);
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}
			}

			svg {
				opacity: 0;
			}

			&:hover {
				background-color: var(--border);
				cursor: pointer;

				svg {
					opacity: 1;
				}
			}
		}
	}
}
</style>