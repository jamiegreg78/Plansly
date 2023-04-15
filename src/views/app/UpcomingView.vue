<template>
	<section class="upcoming-view"
		@scroll="scrollListener">
		<div v-if="loaded">
			<h1 v-if="!filteredList.length">
				You currently have no upcoming tasks!
			</h1>
			<UpcomingList v-for="list, index in filteredList"
				:list="list"
				:key="index" />
		</div>
		<LoadingSpinner v-else />
	</section>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/general/LoadingSpinner.vue';
import { onMounted, ref, computed } from 'vue';
import { useUpcomingTaskStore } from '@/stores/UpcomingTaskStore';
import UpcomingList from '@/components/app/upcoming/UpcomingList.vue';
const loaded = ref<boolean>(false);
const upcomingTaskStore = useUpcomingTaskStore();


const filteredList = computed(() => {
	return upcomingTaskStore.existingDates.concat(upcomingTaskStore.currentAndFutureDates)
});

// Handles adding new dates when at the bottom of the current dates
function scrollListener(event: Event) {
	const target = event.target as HTMLElement;
	// TODO: Maybe add a deadzone: plus or minus 20px or so?
	if (target.scrollTop === (target.scrollHeight - target.offsetHeight)) {
		upcomingTaskStore.addMoreDates()
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