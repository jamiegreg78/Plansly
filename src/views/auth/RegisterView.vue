<template>
	<form class="register-form" id="registerForm">
		<h1>Register</h1>
		<RequestError :message="requestError" />
		<TextInput :required="true" label="Email" type="email" v-model="formValues.email" />

		<TextInput :required="true" label="Password" type="password" v-model="formValues.password"
			:has-error="formErrors.passwordError" />
		<AuthError :validity="!!formErrors.passwordError" message="Password must be atleast 8 characters long" />

		<TextInput label="Confirm Password" type="password" v-model="formValues.confirmPassword"
			:has-error="formErrors.confirmPasswordError" :required="true" />
		<AuthError :validity="!!formErrors.confirmPasswordError" message="Passwords must match" />

		<div class="button-container">
			<Button :disabled="submitDisabled" text="Register" @clicked="submitRegistration($event)" :is-primary="true" />
			<Button text="Log In" @clicked="router.push(AuthRoutes.login)" />
		</div>
	</form>
</template>

<script setup lang="ts">
import type { RegistrationFormValues, AuthenticationFormErrors } from '@/types/AuthTypes'
import TextInput from '@/components/inputs/TextInput.vue'
import Button from '@/components/general/ButtonComponent.vue'
import AuthError from '@/components/auth/AuthError.vue'
import RequestError from '@/components/auth/RequestError.vue'
import { ref, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { RegisterWithEmail } from '@/backend/Authentication'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import { AuthRoutes } from '@/router/RouteNames'

const authState = useAuthenticationStore()
const router = useRouter()

// Disabled the submit button
const submitDisabled = ref<boolean>(false)

// The state variables for each input
const formValues = reactive<RegistrationFormValues>({
	email: ref<string>(''),
	password: ref<string>(''),
	confirmPassword: ref<string>('')
})

// The error variables for each password input
const formErrors = reactive<AuthenticationFormErrors>({
	passwordError: ref<boolean>(false),
	confirmPasswordError: ref<boolean>(false)
})

// The string returned if there is an error with registration
const requestError = ref<string>('')

// Observe the values of the form - check for errors and store them.
// Also toggles the submit buttons state.
watch(formValues, () => {
	formErrors.passwordError = (formValues.password.length > 0 && formValues.password.length < 8)
	formErrors.confirmPasswordError = (formValues.confirmPassword !== formValues.password)
})


// If the form is valid, submit the data - if there is an error, render it on the page.
async function submitRegistration(event: Event) {
	const form = (document.getElementById('registerForm') as HTMLFormElement)
	const passwordInput = (document.getElementById('Password') as HTMLInputElement)
	const confirmPasswordInput = (document.getElementById('ConfirmPassword') as HTMLInputElement)

	requestError.value = ''

	// check the form is valid
	if (form.checkValidity()) {
		event.preventDefault()

		// check if the password is long enough
		if (formValues.password.length < 8) {
			passwordInput.focus()
			return
		}

		// check if the passwords match
		if (formValues.password !== formValues.confirmPassword) {
			confirmPasswordInput.focus()
			return
		}

		// if all inputs are valid (that we can tell) then submit
		submitDisabled.value = true
		const { data, error } = await RegisterWithEmail(formValues.email, formValues.password)

		if (error) {
			requestError.value = error.message
		} else if (data.user?.identities?.length === 0) {
			// if there are no identities, there is already a user with this email
			requestError.value = 'Email already in use'
		} else {
			// Redirect to the OTP page
			authState.setCreatedEmail(formValues.email)
			router.push(AuthRoutes.verify)
		}
		submitDisabled.value = false
	}
}
</script>

<style lang="scss">
@import '@/scss/authforms.scss';

.register-form {
	@include auth-form;
}
</style>