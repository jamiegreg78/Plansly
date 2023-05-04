<template>
	<span :class="props.class">
		<font-awesome-icon icon="fa-solid fa-tag" />
		{{ props.text }}
	</span>
</template>

<script setup lang="ts">
// Currently used to render tags on task cards
export interface ChipProps {
	text: string
	class: string
}
const props = defineProps<ChipProps>()
</script>

<style lang="scss" scoped>
span {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: toRem(4);

	font-size: toRem(14);
	color: var(--text-subtext);

	svg {
		transform: rotateY(180deg);
	}
}
</style>