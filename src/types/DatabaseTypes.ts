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

export interface UpdatedTaskInformation {
	name?: string
	description?: string
	expected_start_date?: string | null
	expected_finish_date?: string | null
	tags?: Array<string>
}

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


export interface UpdatedListInformation {
	name?: string
	description?: string
	work_in_progress_limit?: number | null 
}

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

export interface UpcomingList {
	date: string
	tasks: UpcomingTask[]
}

export interface UpdatedBoardInformation {
	name?: string
	description?: string
	color?: ColorPickerOptions | null
}

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

export interface Module {
	id: number
	created_at: string
	edited_at: string
	user_id: string
	name: string
	description: string
	boards: Array<Board>
}