<template>
	<div class="loader-container">
		<div class="loader"></div>
	</div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.loader-container {
	width: 100%;
	height: 100%;

	display: flex;
	justify-content: center;
	align-items: center;

	.loader {
		width: toRem(100);
		height: toRem(100);

		border: toRem(16) solid var(--border);
		border-top: toRem(16) solid var(--primary);
		border-radius: 50%;

		animation: spin 1s ease infinite;

		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}

			100% {
				transform: rotate(360deg);
			}
		}

	}

}
</style>