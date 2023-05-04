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
		<div>
			<TextInput type="text"
				label="Dependency Search"
				container-class="dependency-search-container"
				placeholder="Search for a task"
				clear-button
				:tab-index="0"
				v-model="search" />
			<div class="results-container"
				v-if="taskOptions.length">
				<span class="result"
					v-for="item, index in taskOptions"
					:key="index"
					@click="$event => {
							selectDependency(item)
							$nextTick().then(() => {
								searchDependencies()
							})
						}">
					{{ item.name }}
					<font-awesome-icon icon="fa-solid fa-plus" />
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import TextInput from '@/components/inputs/TextInput.vue';
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore';
import type { Dependency, Task } from '@/types/DatabaseTypes';
import Fuse from 'fuse.js';
import { ref, watch, onMounted } from 'vue'

export interface DependencyAddProps {
	currentDependencies: Dependency[]
}
const props = defineProps<DependencyAddProps>()

const formVisible = ref<boolean>(false)
const currentBoardStore = useCurrentBoardStore()
const search = ref<string>('')
const taskOptions = ref<Task[]>([])
const mode = ref<'blocked' | 'blocking'>('blocking')
let fuse: any | null = null

const emit = defineEmits(['addDependency', 'update:modelValue'])

// Toggles the mode between blocking and blocked on the new dependency
function toggleMode() {
	mode.value = mode.value === 'blocking' ? 'blocked' : 'blocking'
}

// Adds the dependency to the task
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

// Watch the search input for changes and call the search function
watch(search, async () => {
	searchDependencies()
})

// Searches the board for tasks that match the search input
function searchDependencies() {
	if (fuse) {
		const results = fuse.search(search.value)

		let foundTasks: Task[] = []
		results.forEach((foundItem: any) => {
			foundItem.matches.forEach((match: any) => {
				let task: Task = currentBoardStore.currentBoard?.lists[foundItem.refIndex].tasks?.[match.refIndex] as Task
				// Don't add if the task is already in the array
				// Also don't add if the found task is the task we're adding the dependency to
				if (!foundTasks.includes(task) && task.id !== currentBoardStore.currentTaskOverview?.id) {
					const alreadyBlocked = currentBoardStore.currentTaskOverview?.blocked.findIndex((item) => item.information?.id === task.id) !== -1
					const alreadyBlocking = currentBoardStore.currentTaskOverview?.blocking.findIndex((item) => item.information?.id === task.id) !== -1
					const alreadyInDependencies = props.currentDependencies.findIndex((item: Dependency) => item.blocking_task === task.id || item.blocked_task === task.id) !== -1

					// Finally don't add it if the task is already a dependency
					if (!alreadyBlocked && !alreadyBlocking && !alreadyInDependencies) {
						foundTasks.push(currentBoardStore.currentBoard?.lists[foundItem.refIndex].tasks?.[match.refIndex] as Task)
					}
				}
			})
		})

		taskOptions.value = foundTasks
	}

}

// Casted due to a limitation with Vue.js + TypeScript
watch(currentBoardStore.currentBoard as any, () => {
	initialiseFuse()
})

// Initialise the fuse search
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


<style lang="scss">
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

	.dependency-search-container {
		margin: 0;
		margin-bottom: toRem(4);
	}

	.mode-toggle {
		background-color: transparent;
		border: none;
		border-radius: 8px;
		flex-shrink: 0;
		width: toRem(110);
		@include body-small;
		height: toRem(40);

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
		display: flex;
		flex-wrap: wrap;
		gap: toRem(4);

		.result {
			width: fit-content;
			@include body-small;
			padding: toRem(8);
			display: block;
			color: var(--text);
			border-radius: 8px;
			border: 1px solid var(--border);

			&:hover {
				background-color: var(--green-background);
				border-color: var(--green);
				cursor: pointer;
			}
		}

		&.highlight {
			border-color: var(--primary);
			outline: 1px solid var(--primary);
		}
	}
}
</style>