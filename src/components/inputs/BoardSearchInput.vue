<template>
	<div id="BoardSearchContainer"
		:class="{ 'has-results': currentBoardStore.searchResults.length }">
		<TextInput type="text"
			label="Board Search"
			v-model="boardSearch"
			placeholder="Search Tasks"
			aria-label="Board Search Input"
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
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
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

// Dynamically position the search dropdown
const searchDropdownPosition = ref({})


// Watch the search input and update the search results
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
// Whenever the current board changes, reinitialise the fuse search
// Prevents the search from showing invalid state such as the wrong tasks
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

// Handles the auto-close upon defocus
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

watch(boardSearch, () => {
	resizeListener()
})

const resizeListener = () => {
	const search: HTMLElement | null = document.querySelector('.board-search')

	if (search) {
		searchDropdownPosition.value = {
			top: `${search.getBoundingClientRect().bottom}px`,
			left: `${search.getBoundingClientRect().left + 1}px`,
			width: `${search.getBoundingClientRect().width - 2}px`
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

	const input = document.getElementById('BoardSearch')
	if (input) {
		new ResizeObserver(resizeListener).observe(document.querySelector('body')!)
	}
})

onBeforeUnmount(() => {
	// Makes sure to remove the event listener to prevent memory leaks
	window.removeEventListener('click', closeListener)
})
</script>

<style lang="scss">
#BoardSearchContainer {
	&.has-results {
		.input-wrapper {
			border-radius: 8px 8px 0 0;
			box-shadow: 0 0 0 2px var(--primary);
			border-color: var(--primary);
		}
	}

	.search-dropdown {
		position: absolute;
		z-index: 4;
		background-color: var(--background);
		border-radius: 0 0 8px 8px;
		box-shadow: 0 0 0 3px var(--primary);
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