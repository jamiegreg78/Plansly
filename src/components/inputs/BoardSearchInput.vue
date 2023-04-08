<template>
	<div id="BoardSearchContainer"
		:class="{ 'has-results': currentBoardStore.searchResults.length }">
		<TextInput type="text"
			label="Board Search"
			v-model="boardSearch"
			placeholder="Search Tasks"
			:clear-button="true"
			container-class="board-search" />
		<div class="search-dropdown"
			v-if="currentBoardStore.searchResults.length"
			:style="searchDropdownPosition">
			<span v-for="card, index in currentBoardStore.searchResults"
				:key="index"
				class="result"
				@click="openCard(card)">
				<span class="task-info">
					<span class="name">{{ card.name }}</span>
					<span class="description">{{ card.description }}</span>
				</span>
				<font-awesome-icon icon="fa-solid fa-pen-to-square" />
			</span>
		</div>

	</div>
</template>

<script setup lang="ts">
import { useCurrentBoardStore } from '@/stores/CurrentBoardStore';
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import Fuse from 'fuse.js';
import TextInput from './TextInput.vue';
import type { Task } from '@/types/DatabaseTypes';
const currentBoardStore = useCurrentBoardStore()
const boardSearch = ref<string>('')
let fuse: any | null = null


function openCard(card: Task) {
	currentBoardStore.setCurrentTaskOverview(card)
	currentBoardStore.setSearchResults([])
	boardSearch.value = ''
}

const searchDropdownPosition = computed(() => {
	const search: HTMLElement | null = document.getElementById('BoardSearch')

	if (search) {
		return {
			top: `${search.getBoundingClientRect().bottom}px`,
			left: `${search.getBoundingClientRect().left}px`,
			width: `${search.getBoundingClientRect().width}px`
		}
	}
	return {}
})


watch(boardSearch, () => {
	if (fuse) {
		const results = fuse.search(boardSearch.value)

		let foundTasks: Task[] = []
		results.forEach((foundItem: any) => {
			foundItem.matches.forEach((match: any) => {
				if (match.key === 'tasks.name' || match.key === 'tasks.description') {
					foundTasks.push(currentBoardStore.currentBoard?.lists[foundItem.refIndex].tasks?.[match.refIndex] as Task)
				}
			})
		});

		currentBoardStore.setSearchResults(foundTasks)
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

const closeListener = async (event: Event) => {
	const input: HTMLElement | null = document.getElementById('BoardSearch')
	const inputContainer: HTMLElement | null = document.getElementById('BoardSearchContainer')

	if (input && inputContainer) {
		if (event.target === input || event.target === inputContainer) {
			return
		}
		else {
			boardSearch.value = ''
			currentBoardStore.setSearchResults([])
		}
	}

}

onMounted(() => {
	fuse = new Fuse(currentBoardStore.currentBoard?.lists as any, {
		keys: [
			'tasks.name', 'tasks.description'
		],
		findAllMatches: true,
		useExtendedSearch: true,
		includeMatches: true,
	})

	window.addEventListener('click', closeListener)
})

onBeforeUnmount(() => {
	window.removeEventListener('click', closeListener)
})
</script>

<style lang="scss">
#BoardSearchContainer {
	&.has-results {
		.input-wrapper {
			border-radius: 8px 8px 0 0;
		}
	}

	.search-dropdown {
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