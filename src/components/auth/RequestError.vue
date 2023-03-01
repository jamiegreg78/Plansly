<template >
	<div class="request-error" :class="{ empty: !props.message.length }">
		<p>
			{{ props.message }}
		</p>
	</div>
</template>

<script setup lang="ts">

export interface ErrorMessageProps {
	message: string,
	validity?: boolean
}
const props = defineProps<ErrorMessageProps>()
</script>

<style lang="scss" scoped>
.request-error {
	background-color: var(--error-background);

	border: 2px solid var(--error);
	border-radius: 8px;
	padding: toRem(6) toRem(12);

	height: auto;
	opacity: 1;

	// transition: height 0.3s ease, opacity 0.3s ease;
	transition-property: height, opacity, background-color, border-color, padding;
	transition-duration: 0.3s;
	transition-timing-function: ease;

	&.empty {
		//display: none;
		height: 0;
		padding: 0;
		opacity: 0;
		background-color: var(--background);
		border-color: transparent;
		transition-duration: 0.1s;
	}

	p {
		margin: 0;
		color: var(--error);
	}

	.invalid {
		color: var(--error);
	}

}
</style>