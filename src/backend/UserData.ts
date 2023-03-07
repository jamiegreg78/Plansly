import { supabase } from './Authentication'

// Get overall user data: Modules, boards lists etc...
export async function GetUserData() {
	const { data, error} = 
		await supabase
			.from('modules')
			.select('*')
	
	return { data, error }
}
