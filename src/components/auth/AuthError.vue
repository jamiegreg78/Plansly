<template>
	<p :class="{ invalid: validity }">
		{{ props.message }}
	</p>
</template>

<script setup lang="ts">

export interface ErrorMessageProps {
	message: string,
	validity?: boolean
}
const props = defineProps<ErrorMessageProps>()
</script>

<style lang="scss" scoped>
p {
	margin: 0;
	margin-bottom: toRem(4);
	color: var(--gray);
}

.invalid {
	color: var(--error);
}
</style>