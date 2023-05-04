<template>
	<section class="auth-page">
		<router-view />
		<div class="auth-hero-image-container">
			<img alt="Example Board in use"
				src="../../../public/BoardImage.png" />
		</div>
	</section>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.auth-page {
	display: flex;

	.auth-hero-image-container {
		width: 55vw;
		display: none;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		padding: toRem(16);
		overflow: hidden;

		background-color: var(--background-inset);

		@include breakpoint(desktop) {
			display: flex;
		}

		img {
			display: block;
			width: 100%;

			box-shadow: 0 0 0 4px black;
			border-radius: 8px;
		}
	}
}
</style>
