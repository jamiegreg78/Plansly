<template>
	<form class="login-form"
		id="loginForm">
		<h1>Login</h1>
		<RequestError :message="requestError" />
		<TextInput :show-label="true"
			:required="true"
			label="Email"
			type="email"
			:clear-button="true"
			v-model="formValues.email" />

		<TextInput :show-label="true"
			:required="true"
			label="Password"
			type="password"
			:clear-button="true"
			v-model="formValues.password" />

		<div class="button-container">
			<Button :disabled="submitDisabled"
				:in-progress="submitDisabled"
				text="Log In"
				@clicked="submitLogin($event)"
				:is-primary="true" />
			<Button text="Register"
				@clicked="router.push(AuthRoutes.register)" />
		</div>
	</form>
</template>


<script setup lang="ts">
import TextInput from '@/components/inputs/TextInput.vue'
import Button from '@/components/general/ButtonComponent.vue'
import RequestError from '@/components/auth/RequestError.vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { RegistrationFormValues } from '@/types/AuthTypes'
import { LoginWithEmail } from '@/backend/Authentication'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import { AppRoutes, AuthRoutes } from '@/router/RouteNames'

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

// The string returned if there is an error with registration
const requestError = ref<string>('')

// If the form is valid, submit the data - if there is an error, render it on the page.
async function submitLogin(event: Event) {
	const form = (document.getElementById('loginForm') as HTMLFormElement)

	requestError.value = ''

	// check the form is valid
	if (form.checkValidity()) {
		event.preventDefault()

		// if all inputs are valid (that we can tell) then submit
		submitDisabled.value = true
		const { data, error } = await LoginWithEmail(formValues.email, formValues.password)

		if (error) {
			requestError.value = error.message
		} else {
			authState.setAuthState(data.user!)
			router.push(AppRoutes.dashboard)
		}

		submitDisabled.value = false
	}
}
</script>


<style lang="scss">
@import '@/scss/authforms.scss';

.login-form {
	@include auth-form;
}
</style>