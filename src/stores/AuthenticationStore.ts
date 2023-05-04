import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser } from '@supabase/supabase-js'

// This store is used to store the authentication state of the user.
export const useAuthenticationStore = defineStore('authenticationState', () => {
	const createdEmail = ref<string>('')
	const authState = ref<AuthUser>({
		id: '',
		app_metadata: {},
		user_metadata: {},
		aud: '',
		created_at: '',
		email: ''
	})

	function setCreatedEmail(newEmail: string) {
		createdEmail.value = newEmail
	}

	function setAuthState(newAuthState: AuthUser) {
		authState.value = newAuthState
	}

	return { createdEmail, setCreatedEmail, authState, setAuthState }
})