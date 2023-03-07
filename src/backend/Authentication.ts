import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

// Registers the user using their email, returning the new users data
export async function RegisterWithEmail(email: string, password: string) {
	const { data, error} = await supabase.auth.signUp({
		email, password, 
	})
    
	return { data, error }
}

// Takes the email and verification token and submits it, returning the new users data
export async function VerifyOtp(email: string, token: string) {
	const { data, error } = await supabase.auth.verifyOtp({
		email, token, type:'signup'
	})

	return { data, error }
}

// Logs the user in using the email and password they input. Returns the data of their account
export async function LoginWithEmail(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({email, password})

	return { data, error }
}

// Gets the current user status, returning either their information, or null if they aren't logged in
export async function GetUserStatus() {
	const data  = await supabase.auth.getUser()
	
	return data
}

// Gets the current user section, returning the session data either from local storage or from the server.
export async function GetUserSession() {
	const { data, error } = await supabase.auth.getSession()

	return { data, error }
}

// Logs the user out, returning an error if it fails
export async function LogOutUser() {
	const data = await supabase.auth.signOut()
}