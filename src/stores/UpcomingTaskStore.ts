import { supabase } from "@/backend/Authentication"
import type { Task, UpcomingList, UpcomingTask } from "@/types/DatabaseTypes"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useUpcomingTaskStore = defineStore('upcomingTasksState', () => {
	const dateIncrement = 20
	const existingDates = ref<Array<UpcomingList>>([])
	const currentAndFutureDates = ref<Array<UpcomingList>>([])
	const upcomingTasks = ref<Array<UpcomingTask>>([])
	const tasksFarFuture = ref<Array<UpcomingTask>>([]) // Holds any tasks that are too far forward to be displayed

	// Initialise the current and future dates
	// by default, includes the today and the next 19 days
	function initialiseCurrentAndFutureDates() {
		const dates: UpcomingList[] = []
		const today = new Date()
		
		for (let i = 0; i < dateIncrement; i++) {
			const newDate = new Date(today)
			newDate.setDate(newDate.getDate() + i )
			dates.push({
				date: newDate.toDateString(),
				tasks: []
			})
		}

		currentAndFutureDates.value = dates
	}

	function addMoreDates() {
		const startDate = new Date(currentAndFutureDates.value[currentAndFutureDates.value.length - 1].date)
		const newBatch: UpcomingList[] = []

		for (let i = 1; i <= dateIncrement; i++) {
			const newDate = new Date(startDate)
			newDate.setDate(newDate.getDate() + i )
			currentAndFutureDates.value.push({
				date: newDate.toDateString(),
				tasks: []
			})
		}

		// Copy the far future tasks into the new array so they can be iterated, and removed from the original array
		const farFutureTasksCopy = [...tasksFarFuture.value]

		farFutureTasksCopy.forEach(task => {
			if (task.expected_finish_date) {
				// Check if the date is too far into the future
				const dateTooFar = Date.parse(task.expected_finish_date) > Date.parse(currentAndFutureDates.value[currentAndFutureDates.value.length - 1].date)

				if (!dateTooFar) {
					// add it to the new batch
					const date = new Date(task.expected_finish_date).toDateString()
					const dateIndex = currentAndFutureDates.value.findIndex(d => d.date === date)
					currentAndFutureDates.value[dateIndex].tasks.push(task)
					// Delete it from the far future tasks
					tasksFarFuture.value = tasksFarFuture.value.filter(t => t.id !== task.id)
				}
			}
		})
	}

	async function loadUpcomingTasks() {
		const { data, error } = await supabase
			.from('tasks')
			.select('*')
			.not('expected_finish_date', 'is', null)
			.order('expected_finish_date', { ascending: true })
		if (error) {
			console.error(error)
		} else {
			initialiseCurrentAndFutureDates()

			// Sort the dates
			existingDates.value = []

			// Store the tasks. If the date is too far in the future, store it in a separate array for later use
			// if its within the next 20 days, store it in the current and future dates
			// if its in the past, store it in the existing dates
			data.forEach((task: UpcomingTask) => {
				if (task.expected_finish_date) {
					const date = new Date(task.expected_finish_date).toDateString()
					const dateIsInFutureIndex = currentAndFutureDates.value.findIndex(d => d.date === date)
					const dateExistsIndex = existingDates.value.findIndex(d => d.date === date)

					// Check if the date is too far into the future
					const dateTooFar = Date.parse(date) > Date.parse(currentAndFutureDates.value[currentAndFutureDates.value.length - 1].date)

					if (dateTooFar) {
						tasksFarFuture.value.push(task)
					} else if (dateIsInFutureIndex !== -1) {
						currentAndFutureDates.value[dateIsInFutureIndex].tasks.push(task)
					} else if (dateExistsIndex === -1) {
						existingDates.value.push({
							date: date,
							tasks: [task]
						})
					} else {
						existingDates.value[dateExistsIndex].tasks.push(task)
					}
				}
			})

		}
	}

	function removeFromUpcomingTasks(task: Task) {
		upcomingTasks.value = upcomingTasks.value.filter(t => t.id !== task.id)
	}

	return {
		existingDates,
		currentAndFutureDates,
		upcomingTasks,
		addMoreDates,
		loadUpcomingTasks,
		removeFromUpcomingTasks
	}
})