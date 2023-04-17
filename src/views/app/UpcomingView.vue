<template>
	<section class="upcoming-view"
		@scroll="scrollListener">
		<div v-if="loaded">
			<UpcomingList :list-index="index"
				v-if="upcomingTaskStore.taskCount"
				v-for="list, index in upcomingTaskStore.currentAndFutureDates"
				:list="list"
				:key="index" />
		</div>
		<h1 v-if="!upcomingTaskStore.taskCount && loaded">
			You currently have no upcoming tasks!
		</h1>
		<LoadingSpinner v-if="!loaded" />
	</section>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import { onMounted, ref } from 'vue';
import { useUpcomingTaskStore } from '@/stores/UpcomingTaskStore';
import UpcomingList from '@/components/app/upcoming/UpcomingList.vue';
const loaded = ref<boolean>(false);
const upcomingTaskStore = useUpcomingTaskStore();


// Handles adding new dates when at the bottom of the current dates
function scrollListener(event: Event) {
	const target = event.target as HTMLElement;
	if (target.scrollTop > (target.scrollHeight - target.offsetHeight) - 10) {
		upcomingTaskStore.addMoreDates();
	}
}

onMounted(async () => {
	await upcomingTaskStore.loadUpcomingTasks();
	loaded.value = true;
});
</script>

<style lang="scss">
section.upcoming-view {
	padding: toRem(16);

	h1 {
		width: 100%;
		text-align: center;
		@include body-large;
	}
}
</style>