<template v-if="userData.userData.length">
	<section class="dashboard">
		<div class="content"
			:class="{ 'close-on-mobile': sideContainerIsOpen }">
			<div v-if="!userData.userData[currentModuleIndex]?.boards || !userData.userData[currentModuleIndex].boards.length"
				class="no-boards">
				<h2>
					You have no boards
				</h2>
				<p>
					Create a board to start managing your tasks
				</p>
				<ButtonComponent text="Create a New Board"
					:is-primary="true"
					@clicked="sideContainerIsOpen = true" />
			</div>
			<BoardList v-else
				:boards="userData.userData[currentModuleIndex].boards"
				@open="sideContainerIsOpen = true" />
		</div>
		<div class="side-container"
			:class="{ open: sideContainerIsOpen }">
			<NewBoardForm @close="sideContainerIsOpen = false"
				v-if="sideContainerIsOpen" />
		</div>
	</section>
</template>

<script setup lang="ts">
import BoardList from '@/components/app/BoardList.vue'
import NewBoardForm from '@/components/app/NewBoardForm.vue'
import ButtonComponent from '@/components/general/ButtonComponent.vue'
import { AppRoutes } from '@/router/RouteNames'
import { useUserDataStore } from '@/stores/UserDataStore'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const userData = useUserDataStore()
const currentModuleIndex = ref<number>(0)

const sideContainerIsOpen = ref<boolean>(false)
const router = useRouter()

onMounted(() => {
	const currentModuleId = parseInt(router.currentRoute.value.params.moduleId as string)
	currentModuleIndex.value = userData.getModuleIndex(currentModuleId)
	if (currentModuleIndex.value === -1) {
		router.push(AppRoutes.notFound)
	}
})
</script>

<style lang="scss">
.dashboard {
	display: flex;
	width: 100%;

	.content {
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
				transition: width 0.3s ease;
			}
		}

	}

	.no-boards {
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}

}
</style>