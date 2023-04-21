<template>
	<div class="module-list-container">
		<div class="title-container">
			<h2>Modules</h2>
		</div>
		<div class="module-list">
			<span class="module-card new-module"
				@click="$emit('open')">
				<font-awesome-icon icon="fa-solid fa-plus" />
				Create Module
			</span>
			<span class="module-card"
				v-for="(item, index) in props.modules"
				:key="index"
				@click="router.push(AppRoutes.module.replace(':moduleId', item.id.toString()))">
				{{ item.name }}
				<button class="delete-button"
					@click.stop="deletingModuleId = item.id"
					tabindex="0">
					<font-awesome-icon icon="fa-solid fa-xmark" />
				</button>
			</span>
		</div>
	</div>
	<Delete v-if="deletingModuleId !== null"
		mode="module"
		@confirm="deleteModule"
		@cancel="deletingModuleId = null"
		:id="deletingModuleId" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { AppRoutes } from '@/router/RouteNames'
import type { Module } from '@/types/DatabaseTypes'
import { useRouter } from 'vue-router'
import Delete from './Delete.vue';
import { useUserDataStore } from '@/stores/UserDataStore';

export interface ModuleListProps {
	modules: Array<Module>
}
const props = defineProps<ModuleListProps>()
const emit = defineEmits(['open'])
const userDataStore = useUserDataStore()

const router = useRouter()

const deletingModuleId = ref<number | null>(null)

async function deleteModule() {
	if (deletingModuleId.value !== null) {
		await userDataStore.deleteModule(deletingModuleId.value)
		deletingModuleId.value = null
	}
}
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
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding: toRem(16) toRem(8);

			@include regular-semibold;
			font-size: toRem(14);

			border: 1px solid var(--border);
			border-radius: 8px;

			transition: background-color 0.3s ease;

			.delete-button {
				@include squared-button;
			}

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

			&:not(.new-module) {
				padding: toRem(8)
			}

			&.new-module {
				display: block;
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