<template>
	<section class="auth-page">
		<router-view />
		<div class="auth-hero-image"></div>
	</section>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.auth-page {
	display: flex;

	.auth-hero-image {
		width: 55vw;
		display: none;
		flex-shrink: 0;

		background-color: var(--background-inset);

		@include breakpoint(desktop) {
			display: block;
		}
	}
}
</style>
