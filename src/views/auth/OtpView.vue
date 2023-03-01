<template>
	<form class="otp-form" id="otpForm">
		<h1>Confirm Registration</h1>
		<RequestError :message="requestError" />
		<p>Enter the code we just sent to your email</p>
		<div class="otp-input-container">
			<label for="verificationCode">Verification Code</label>
			<input v-model="otpValue" id="verificationCode" type="number" maxlength="6" required
				:class="{ error: requestError.length }" />
		</div>
		<ButtonComponent text="Confirm" :is-primary="true" :disabled="submitDisabled" @clicked="submitCode" />
	</form>
</template>

<script setup lang="ts">
import ButtonComponent from '@/components/general/ButtonComponent.vue'
import RequestError from '@/components/auth/RequestError.vue'
import { ref, watch } from 'vue'
import { VerifyOtp } from '@/backend/Authentication'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'
import router from '@/router'

const authState = useAuthenticationStore()
const otpValue = ref<number>()
const submitDisabled = ref<boolean>(true)
const requestError = ref<string>('')

// Ensure the value is never over 6 long & handle button disabled state
watch(otpValue, () => {
	requestError.value = ''

	submitDisabled.value = (typeof otpValue.value !== 'undefined' && otpValue.value.toString().length < 6)

	// if the value is longer than 6 long
	if (otpValue.value && otpValue.value?.toString().length > 6) {
		otpValue.value = parseInt(otpValue.value?.toString().slice(0, 6))
	}
})

async function submitCode(event: Event) {
	const form = (document.getElementById('otpForm') as HTMLFormElement)
	const codeLength: number | undefined = otpValue.value?.toString().length
	requestError.value = ''

	// if the input is fulled
	if (form.checkValidity()) {
		event.preventDefault()
	} else {
		return
	}

	if (typeof codeLength !== 'undefined' && codeLength === 6) {
		event.preventDefault()

		// TODO: Email doesn't persist
		const { data, error } = await VerifyOtp(authState.createdEmail, otpValue.value!.toString())

		if (error) {
			requestError.value = error.message
		} else {
			authState.setAuthState(data.user!)
			router.push('/app/dashboard')
		}
	}
}
</script>

<style lang="scss">
@import '@/scss/inputs.scss';
@import '@/scss/authforms.scss';

.otp-form {
	@include auth-form;

	.error {
		color: var(--error)
	}

	.otp-input-container {
		width: 100%;
		margin-bottom: toRem(10);

		label {
			display: block;
			margin-bottom: toRem(4);

			@include regular-semibold;
			color: var(--gray);
		}

		input {
			@include text-input;
			text-align: center;
		}
	}
}
</style>