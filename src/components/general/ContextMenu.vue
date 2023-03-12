<template>
	<div id="contextMenu" ref="componentRef" :style="{
		top: `${coordinates.y + 55}px`,
		left: `${coordinates.x}px`,

	}">
		<span class="menu-item" v-for="item, index in props.items" :key="index"
			@click="{ item.callback(); $emit('closeContextMenu') }">
			<font-awesome-icon :icon="item.icon" />
			{{ item.text }}
		</span>
	</div>
</template>

<script setup lang="ts">
import { attachClickAwayEvent } from '@/utils/EventListeners'
import { ref, onMounted, onUnmounted } from 'vue'


export interface ContextMenuItems {
	text: string,
	icon: string,
	callback: Function
}
export interface ContextMenuProps {
	exclude: HTMLElement
	items: Array<ContextMenuItems>
}
const props = defineProps<ContextMenuProps>()
const componentRef = ref()
const coordinates = ref({ x: 0, y: 0 })

attachClickAwayEvent(componentRef, () => {
	emit('closeContextMenu')
}, props.exclude)

onMounted(() => {
	toggleScrolling()
	const buttonCoordinates = props.exclude.getBoundingClientRect()
	coordinates.value = props.exclude.getBoundingClientRect()
	const screenDimensions = {
		width: window.innerWidth,
		height: window.innerHeight
	}
	const contextMenu = document.getElementById('contextMenu')
	const boundingClient = contextMenu?.getBoundingClientRect()

	// check if it will go past the bottom of the screen
	// const exceedsBottom = boundingClient!.bottom > screenDimensions.height
	const exceedsBottom = buttonCoordinates.top + boundingClient!.width > screenDimensions.height

	// check if it will go past the right of the screen
	const exceedsRight = buttonCoordinates.right + boundingClient!.width > screenDimensions.width

	coordinates.value = {
		x: exceedsRight ? buttonCoordinates.x - boundingClient!.width : buttonCoordinates.x,
		y: exceedsBottom ? buttonCoordinates.y - boundingClient!.height : buttonCoordinates.y
	}

})

onUnmounted(() => {
	toggleScrolling()
})

function toggleScrolling() {
	const docBody = document.querySelector('.board-content')
	if (docBody?.classList.contains('prevent-scroll')) {
		docBody.classList.remove('prevent-scroll')
	} else {
		docBody?.classList.add('prevent-scroll')
	}
}

const emit = defineEmits(['closeContextMenu'])
</script>


<style lang="scss">
#contextMenu {
	position: absolute;
	display: flex;
	flex-direction: column;
	border: 1px solid var(--border);
	border-radius: 8px;
	overflow: hidden;
	background-color: var(--background);
	min-width: toRem(150);

	.menu-item {
		display: flex;
		justify-content: start;
		align-items: center;
		gap: toRem(8);
		padding: toRem(8);

		&:hover {
			background-color: var(--background-inset);

			cursor: pointer;
		}
	}
}
</style>