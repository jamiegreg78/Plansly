<template>
	<div class="dependency-row">
		<button class="dependency-mode mode-toggle"
			:class="computedClass"
			@click="$emit('toggleDependencyMode', dependency)">
			{{ dependency.blocked_task !== currentTaskId ? 'Blocking' : 'Blocked' }}
			<font-awesome-icon icon="fa-solid fa-right-left" />
		</button>
		<span class="dependency">
			{{ dependency.information.name }}
			<button class="delete-dependency"
				@click="$emit('deleteDependency', dependency)">
				<font-awesome-icon icon="fa-solid fa-xmark" />
			</button>
		</span>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// TODO: Type for dependency
export interface DepedencyProps {
	dependency: any,
	currentTaskId: number
}
const props = defineProps<DepedencyProps>()
const emit = defineEmits(['deleteDependency', 'toggleDependencyMode'])


const computedClass = computed(() => {
	return props.dependency.blocked_task === props.currentTaskId ? 'blocked' : 'blocking'
})
</script>

<style lang="scss">
.dependency-row {
	display: flex;
	align-items: center;

	.dependency {
		display: flex;
		align-items: center;
		gap: toRem(8);
		font-size: toRem(14);
		padding: toRem(4) toRem(8);
		border: 1px solid transparent;
		border-radius: 8px;
		min-width: toRem(32);
		text-align: center;

		button {
			background-color: transparent;
			border: 1px solid transparent;
			opacity: 0.5;
			border-radius: 8px;

			&:hover {
				opacity: 1;
				border-color: var(--border);
				background-color: var(--background-inset);
			}
		}

		&:hover {
			cursor: pointer;
			background-color: var(--background-inset);
		}
	}

	.mode-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		border: none;
		border-radius: 8px;
		flex-shrink: 0;
		font-size: toRem(14);
		height: 100%;
		padding: toRem(4) toRem(8);
		gap: toRem(8);

		&.blocking {
			color: var(--error);
		}

		&.blocked {
			color: var(--orange);
		}

		&:hover {
			background-color: var(--background-inset);
		}
	}
}
</style>