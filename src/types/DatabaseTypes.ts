import type { ColorPickerOptions } from './ColorPicker'

export interface Task {
	id: number
	created_at: string
	edited_at: string
	user_id: string
	name: string
	description: string
	board: number
	expected_start_date: string
	expected_finish_date: string
}

export interface List {
	id: number
	created_at: string
	edited_at: string
	user_id: string
	name: string
	description: string
	board: number
	work_in_progress_limit: number
	tasks: Array<Task>
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