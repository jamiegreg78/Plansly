<template>
	<section class="dashboard">
		<div class="content" :class="{ 'close-on-mobile': sideContainerIsOpen }">
			<div v-if="!userData.userData.length" class="no-modules">
				<h2>
					Start using Plansly
				</h2>
				<p>
					Create a module to begin working
				</p>
				<ButtonComponent text="Create a New Module" :is-primary="true" @clicked="sideContainerIsOpen = true" />
			</div>
			<ModuleList v-else :modules="userData.userData" @open="sideContainerIsOpen = true" />
		</div>
		<div class="side-container" :class="{ open: sideContainerIsOpen }">
			<NewModuleForm v-if="sideContainerIsOpen" @close="sideContainerIsOpen = !sideContainerIsOpen" />
		</div>
	</section>
</template>

<script setup lang="ts">
import ButtonComponent from '@/components/general/ButtonComponent.vue'
import NewModuleForm from '@/components/app/NewModuleForm.vue'
import ModuleList from '@/components/app/ModuleList.vue'
import { useUserDataStore } from '@/stores/UserDataStore'
import { ref } from 'vue'
const userData = useUserDataStore()

const sideContainerIsOpen = ref<boolean>(false)
</script>

<style lang="scss">
.dashboard {
	display: flex;
	width: 100%;

	.content {
		padding: toRem(16);
		width: 100%;

		@include breakpoint(desktop) {
			display: flex;
			gap: toRem(16);
			transition: width 0.3s ease;
		}

		&.close-on-mobile {
			padding: 0;
			width: 0%;
			overflow: hidden;

			@include breakpoint(desktop) {
				padding: toRem(16);
				width: 50%;
				overflow: auto;
			}
		}
	}

	.side-container {
		width: 0;
		padding: 0;
		overflow: hidden;

		&.open {
			width: 100%;
			padding: toRem(16);

			@include breakpoint(desktop) {
				width: 50%;
				border-left: 1px solid var(--border);
			}
		}

	}

	.no-modules {
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}

}
</style>