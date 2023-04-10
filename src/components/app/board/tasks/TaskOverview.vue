<template>
	<div class="task-overview-container"
		@click="closeOverview">
		<div class="overview"
			@click.stop>
			<div class="top-section">
				<button class="completed-status"
					tabindex="0"
					:class="{ completed: currentBoardStore.currentTaskOverview?.completed, locked: !isCompletable }"
					@click="() => {
						if (isCompletable) {
							currentBoardStore.toggleTaskCompleted(currentBoardStore.currentTaskOverview as Task)
						}
					}">
					<font-awesome-icon v-if="!isCompletable"
						icon="fa-solid fa-lock" />
					<font-awesome-icon v-else-if="currentBoardStore.currentTaskOverview?.completed"
						icon="fa-solid fa-circle-check" />
					<font-awesome-icon v-else
						icon="fa-regular fa-circle-check" />
				</button>
				<input class="task-name"
					id="newNameInput"
					type="text"
					v-model="name"
					:tabindex="0" />
				<button class="close-button"
					tabindex="2"
					@click="closeOverview">
					<font-awesome-icon icon="fa-solid fa-xmark" />
				</button>
			</div>
			<div class="task-details">
				<TextInput v-model="description"
					:show-label="true"
					label="Description"
					type="text"
					multi-line
					:tab-index="0" />
				<DateInput label="Expected Start"
					v-model="expectedStart"
					:max-value="expectedFinish"
					tabindex="0" />
				<DateInput label="Expected Finish"
					v-model="expectedFinish"
					:min-value="expectedStart"
					tabindex="0" />
				<TagInput label="Add Tags"
					@selected-tag="addTag"
					:existing-tags="tagPool"
					:task-tags="tags" />
				<div class="tag-container">
					<span class="tag"
						v-for="tag, index in tags"
						:key="index"
						@click="tags.splice(tags.indexOf(tag), 1)">
						{{ tag }}
					</span>
				</div>
				<div class="dependencies">
					<h3 class="dependency-section-label">Dependencies</h3>
					<div class="current-dependencies"
						v-if="dependencyArray.length">
						<ExistingDependency v-for="dep, index in dependencyArray"
							:dependency="dep"
							:current-task-id="currentBoardStore.currentTaskOverview?.id!"
							:key="index"
							@toggle-dependency-mode="toggleDependencyMode"
							@delete-dependency="deleteDependency" />
					</div>
					<DependencyAdd :current-dependencies="dependencyArray"
						@add-dependency="addDependency($event)" />
				</div>
			</div>
			<div class="delete-container">
				<div class="options">
					<button class="delete-button"
						tabindex="0"
						@click="deleteMenuIsOpen = true">
						Delete
					</button>
					<span v-if="deleteMenuIsOpen">Are you sure?</span>
					<button class="confirm"
						tabindex="0"
						v-if="deleteMenuIsOpen"
						@click="deleteTask">
						<font-awesome-icon icon="fa-solid fa-check" />
					</button>
					<button class="cancel"
						tabindex="0"
						v-if="deleteMenuIsOpen"
						@click="deleteMenuIsOpen = false">
						<font-awesome-icon icon="fa-solid fa-xmark" />
					</button>
				</div>
			</div>
			<ButtonComponent text="Save Changes"
				:is-primary="true"
				@clicked="saveChanges"
				:tab-index="0" />
		</div>
	</div>
</template>

<script setup lang="ts">
import ButtonComponent from '@/components/general/ButtonComponent.vue'
import DateInput from '@/components/inputs/DateInput.vue'
import TagInput from '@/components/inputs/TagInput.vue'
import TextInput from '@/components/inputs/TextInput.vue'
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore'
import type { Dependency, Task } from '@/types/DatabaseTypes'
import { ref, onBeforeMount, computed } from 'vue'
import DependencyAdd from './DependencyAdd.vue'
import ExistingDependency from './ExistingDependency.vue'
const currentBoardStore = useCurrentBoardStore()
const deleteMenuIsOpen = ref<boolean>(false)

const name = ref<string>('')
const description = ref<string>('')
const expectedStart = ref<string>('')
const expectedFinish = ref<string>('')
const tags = ref<Array<string>>([])
const dependencyArray = ref<Array<any>>([])
const deletedDependencies = ref<Array<any>>([])

const isCompletable = computed(() => {
	// If the current task is already complete, just show it - don't forcibly un-complete it
	if (currentBoardStore.currentTaskOverview?.completed) {
		return true
	}

	// If there are no tasks blocking this one, return true
	if (!currentBoardStore.currentTaskOverview?.blocked.length) {
		return true
	} else {
		// if at least one of these is not completed, return false
		return currentBoardStore.currentTaskOverview.blocked.every((dependency) => {
			return currentBoardStore.currentBoard?.lists?.find((list) => { return list.id === dependency.information?.list })?.tasks?.find((task) => {
				return task.id === dependency.information?.id
			})?.completed
		})
	}
})

function addDependency(newDependencyInformation: Dependency) {
	const copiedDependencyArray = [...dependencyArray.value]
	copiedDependencyArray.push(newDependencyInformation)

	dependencyArray.value = copiedDependencyArray
}

function deleteDependency(deletedDependency: Dependency) {
	dependencyArray.value.splice(dependencyArray.value.indexOf(deletedDependency), 1)

	// If there is no id, then it hasn't been saved to the database yet
	if (deletedDependency.id !== undefined) {
		deletedDependencies.value.push(deletedDependency)
	}
}

function toggleDependencyMode(dependency: Dependency) {
	const dependencyIndex: number = dependencyArray.value.indexOf(dependency)
	const copiedDependency = { ...dependencyArray.value[dependencyIndex] }

	dependencyArray.value[dependencyIndex] = {
		...copiedDependency,
		blocked_task: copiedDependency.blocking_task,
		blocking_task: copiedDependency.blocked_task
	}
}

const tagPool = computed(() => {
	let tagArray: Array<string> = []
	currentBoardStore.currentBoard?.lists.forEach(list => {
		list.tasks?.forEach(task => {
			task.tags?.forEach(tag => {
				if (!tagArray.includes(tag)) {
					tagArray.push(tag)
				}
			})
		})
	})
	return tagArray
})

function addTag(newTag: string) {
	tags.value.push(newTag)
}

async function saveChanges() {
	const convertedStartDate: string | null = expectedStart.value.length ? new Date(expectedStart.value).toISOString() : null
	const convertedFinishDate: string | null = expectedFinish.value.length ? new Date(expectedFinish.value).toISOString() : null

	await currentBoardStore.changeTaskDetails({
		name: name.value,
		description: description.value,
		expected_start_date: convertedStartDate,
		expected_finish_date: convertedFinishDate,
		tags: tags.value,
	}, dependencyArray.value, deletedDependencies.value)

	closeOverview()
}

onBeforeMount(() => {
	name.value = currentBoardStore.currentTaskOverview!.name
	// Populate the state if there is any existing data
	if (currentBoardStore.currentTaskOverview?.description) {
		description.value = currentBoardStore.currentTaskOverview.description
	}
	if (currentBoardStore.currentTaskOverview?.expected_start_date) {
		expectedStart.value = currentBoardStore.currentTaskOverview.expected_start_date.slice(0, -9)
	}
	if (currentBoardStore.currentTaskOverview?.expected_finish_date) {
		expectedFinish.value = currentBoardStore.currentTaskOverview.expected_finish_date.slice(0, -9)
	}
	if (currentBoardStore.currentTaskOverview?.tags) {
		tags.value = [...currentBoardStore.currentTaskOverview.tags]
	}
	if (currentBoardStore.currentTaskOverview?.blocked) {
		dependencyArray.value.push(...currentBoardStore.currentTaskOverview?.blocked)
	}
	if (currentBoardStore.currentTaskOverview?.blocking) {
		dependencyArray.value.push(...currentBoardStore.currentTaskOverview?.blocking)
	}
})

function closeOverview() {
	currentBoardStore.setCurrentTaskOverview(undefined)
}

async function deleteTask() {
	deleteMenuIsOpen.value = false
	await currentBoardStore.deleteTask(currentBoardStore.currentTaskOverview!)
	currentBoardStore.setCurrentTaskOverview(undefined)
}


</script>

<style lang="scss">
.task-overview-container {
	@include modal-form;

	.task-details {
		.dependency-section-label {
			@include regular-semibold;
			color: var(--gray);
			margin: 0 0 toRem(4) 0;
		}

		.dependencies {
			margin-bottom: toRem(8);
		}

		.tag-container {
			display: flex;
			gap: toRem(4);
			flex-wrap: wrap;
			margin-bottom: toRem(10);

			.tag {
				@include tag-chip;

				&:hover {
					border-color: var(--error);
					background-color: var(--error-background);
					cursor: pointer;

				}
			}

		}
	}

	.completed-status {
		margin-right: toRem(16);
		padding: 0;
		border: none;
		background: transparent;
		@include body-small;

		transition: color 0 ease;
		font-size: toRem(20);

		&.completed {
			color: var(--green);
		}

		&:hover {
			cursor: pointer;
		}

		&.locked {
			color: var(--error);
		}
	}
}
</style>