// This file contains the types that represent the database structure - partially
// Some are modified to be more useful in the application
// Some values are products of joins and are not present in the database
import type { ColorPickerOptions } from './ColorPicker'

// Represents the dependencies - the optional fields are only present after the dependency is inserted into the database
export interface Dependency {
	id?: number | null
	created_at?: string
	user_id?: string
	blocking_task: number
	blocked_task: number
	information?: {
		id: number
		list: number
		name: string
		description: string
	}
}

// Represents the new task information used when updating a task
export interface UpdatedTaskInformation {
	name?: string
	description?: string
	expected_start_date?: string | null
	expected_finish_date?: string | null
	tags?: Array<string>
}

// Represents a task
export interface Task {
	id: number
	created_at: string
	edited_at: string
	user_id: string
	name: string
	description: string
	list: number
	expected_start_date: string | null
	expected_finish_date: string | null
	completed: boolean
	order: number
	tags: Array<string>
	blocking: Dependency[]
	blocked: Dependency[]
	// The following must be refactored when the PostgREST API is updated to support the spread operator
	moduleId?: {
		boards: {
			module: {
				id: number
			}
		}
	},
	boardId?: {
		boards: {
			id: number
		}
	},	
}

// Represents the new list information used when updating a list
export interface UpdatedListInformation {
	name?: string
	description?: string
	work_in_progress_limit?: number | null 
}

// Represents a list
export interface List {
	id: number
	created_at: string
	edited_at: string
	user_id: string
	name: string
	description: string
	board: number
	work_in_progress_limit: number | null
	tasks?: Array<Task>
	order: number
}

// Represents the list of upcoming tasks
export interface UpcomingList {
	date: string
	tasks: Task[]
}

// Represents the new board information used when updating a board
export interface UpdatedBoardInformation {
	name?: string
	description?: string
	color?: ColorPickerOptions | null
}

// Represents a board
export interface Board {
	id: number
	created_at: string
	edited_at: string
	user_id: string
	name: string
	description: string
	module: number
	color: ColorPickerOptions | null
	lists: Array<List>
}

// Represents a module
export interface Module {
	id: number
	created_at: string
	edited_at: string
	user_id: string
	name: string
	description: string
	boards: Array<Board>
}