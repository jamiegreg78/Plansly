<template>
	<div class="module-list-container">
		<div class="title-container">
			<h2>Modules</h2>
		</div>
		<div class="module-list">
			<span class="module-card new-module" @click="$emit('open')">
				<font-awesome-icon icon="fa-solid fa-plus" />
				Create Module
			</span>
			<span class="module-card" v-for="(item, index) in props.modules" :key="index"
				@click="router.push(AppRoutes.module.replace(':moduleId', item.id.toString()))">
				{{ item.name }}
			</span>
		</div>
	</div>
</template>
<script setup lang="ts">
import { AppRoutes } from '@/router/RouteNames'
import type { Module } from '@/types/DatabaseTypes'
import { useRouter } from 'vue-router'

export interface ModuleListProps {
	modules: Array<Module>
}
const props = defineProps<ModuleListProps>()
const emit = defineEmits(['open'])

const router = useRouter()
</script>

<style lang="scss">
.module-list-container {
	width: 100%;
	max-width: toRem(1200);
	border-radius: toRem(8);

	@include breakpoint(desktop) {
		width: 50%;
		@include drop-shadow;
	}

	.title-container {
		width: 100%;
		border-bottom: 1px solid var(--border);
		padding: toRem(16);

		h2 {
			@include body-large;
			margin: 0;
		}
	}

	.module-list {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		row-gap: toRem(16);
		justify-content: space-between;
		padding: toRem(16) 0;

		@include breakpoint(desktop) {
			padding: toRem(16);
		}

		.module-card {
			width: 100%;
			padding: toRem(16) toRem(8);

			@include regular-semibold;
			font-size: toRem(14);

			border: 1px solid var(--border);
			border-radius: 8px;

			transition: background-color 0.3s ease;

			&:hover {
				background-color: var(--background-inset);
				cursor: pointer;
			}

			@include breakpoint(tablet) {
				font-size: toRem(16);
			}

			@include breakpoint(desktop) {
				// width: calc(25% - 8px);
			}

			&.new-module {
				background-color: var(--background-inset);
				font-weight: 400;
			}

			&:last-of-type {
				margin-bottom: 16px;
			}
		}
	}

}
</style>