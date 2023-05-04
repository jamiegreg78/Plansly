import { supabase } from "@/backend/Authentication"
import type { Task, UpcomingList } from "@/types/DatabaseTypes"
import { defineStore } from "pinia"
import { ref, computed } from "vue"

// This store contains the global state for the upcoming tasks.
export const useUpcomingTaskStore = defineStore('upcomingTasksState', () => {
	const dateIncrement = 10 // How many days are added each time
	// State	
	const currentAndFutureDates = ref<Array<UpcomingList>>([])
	const tasksFarFuture = ref<Array<Task>>([]) // Holds any tasks that are too far forward to be displayed
	const taskCount = computed(() => {
		let count = 0
		currentAndFutureDates.value.forEach(list => {
			count += list.tasks.length
		})
		tasksFarFuture.value.forEach(task => {
			count++
		})
		return count
	})

	// Initialise the current and future dates
	// Creates a batch of dates to start with
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

	// Handles changing the date of a task when it is dragged to a new date
	async function updateDate(task: Task, oldIndex: number, newIndex: number) {
		// Set the tasks date to the new date
		const date = new Date(currentAndFutureDates.value[newIndex].date)
		task.expected_finish_date = date.toISOString()

		// TODO: Maybe instead of midnight, try 12pm?

		const result = await supabase
			.from('tasks')
			.update({ expected_finish_date: task.expected_finish_date })
			.eq('id', task.id)
			.select()
		if (result.error) {
			console.error(result.error)
		} else {
			const taskIndex = currentAndFutureDates.value[oldIndex].tasks.indexOf(task)
			const oldListCopy = currentAndFutureDates.value[oldIndex].tasks.slice()
			const newListCopy = currentAndFutureDates.value[newIndex].tasks.slice()
			// Remove the item from the old array
			oldListCopy.splice(taskIndex, 1)
			// Add it to the new array
			newListCopy.push(task)
			currentAndFutureDates.value[newIndex].tasks.push(task)

			// Update the old array
			currentAndFutureDates.value[oldIndex].tasks = oldListCopy
			// Update the new array
			currentAndFutureDates.value[newIndex].tasks = newListCopy
		}
	}

	// Adds another batch of dates to the current and future dates
	// Typically called when the user scrolls to the bottom of the list
	function addMoreDates() {
		const startDate = new Date(currentAndFutureDates.value[currentAndFutureDates.value.length - 1].date)

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

	// Loads the upcoming tasks from the database
	// TODO: When the PostgREST update is released, refactor this to use the new spread operator
	// This may not be released prior to deadline, so may not be possible
	async function loadUpcomingTasks() {
		const { data, error } = await supabase
			.from('tasks')
			.select(`
				*,
				moduleId: lists(boards(module(id))),
				boardId: lists(boards(id)),
				blocking:blocking_dependencies!blocking_dependencies_blocking_task_fkey (*, information:tasks!blocking_dependencies_blocked_task_fkey (id, name, description, list)),
				blocked:blocking_dependencies!blocking_dependencies_blocked_task_fkey (*, information:tasks!blocking_dependencies_blocking_task_fkey (id, name, description, list))
				)
			`)
			.not('expected_finish_date', 'is', null)
			.not('completed', 'is', true)
			.order('expected_finish_date', { ascending: true })
			.returns<Task[]>()
		if (error) {
			console.error(error)
		} else {
			if (data && data.length) {
				initialiseCurrentAndFutureDates()

				for (let i = data.length -1; i >= 0; i--) {
					const task = data[i]
					if (task.expected_finish_date) {
						const date = new Date(task.expected_finish_date).toDateString()
						const dateIndex = currentAndFutureDates.value.findIndex(d => d.date === date)
						const dateTooFar = Date.parse(date) > Date.parse(currentAndFutureDates.value[currentAndFutureDates.value.length - 1].date)

						if (dateTooFar) { // Too far into the future
							tasksFarFuture.value.push(task)
						} else if (dateIndex !== -1) { // Just add
							currentAndFutureDates.value[dateIndex].tasks.push(task)
						} else if (dateIndex === -1) { // If the date is in the past, add it to the front of the array
							currentAndFutureDates.value.unshift({
								date: date,
								tasks: [task]
							})
						}
					}
				}
			}
		}
	}

	// Remove the task from the current and future dates
	// Typically called when a task is completed
	function removeTask(task: Task) {
		currentAndFutureDates.value.forEach(date => {
			date.tasks = date.tasks.filter(t => t.id !== task.id)
		})
	}

	return {
		currentAndFutureDates,
		taskCount,
		removeTask,
		updateDate,
		addMoreDates,
		loadUpcomingTasks,
		tasksFarFuture
	}
})