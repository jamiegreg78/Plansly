<template>
  <form class="register-form" id="registerForm">
    <h1>Register</h1>
    <TextInput label="Email" type="email" v-model="formValues.email"/>
    <TextInput label="Password" type="password" v-model="formValues.password" :has-error="formErrors.passwordError" />
    <AuthError :validity="!!formErrors.passwordError" message="Password must be atleast 8 characters long"/>
    <TextInput
      label="Confirm Password"
      type="password"
      v-model="formValues.confirmPassword"
      :has-error="formErrors.confirmPasswordError"
    />
    <AuthError :validity="!!formErrors.confirmPasswordError" message="Passwords must match"/>
    <div class="button-container">
      <Button 
        :disabled="submitDisabled"
        text="Register"
        @clicked="submitRegistration"
        :is-primary="true"
        />
      <Button text="Log In" @clicked="router.push('login')" />
    </div>
  </form>
</template>

<script setup lang="ts">
import TextInput from '@/components/inputs/TextInput.vue'
import Button from '@/components/general/ButtonComponent.vue'
import AuthError from '@/components/auth/AuthError.vue'
import { ref, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { RegistrationFormValues, AuthenticationFormErrors } from '@/types/AuthTypes'

import { RegisterWithEmail } from '@/backend/Authentication'

const router = useRouter()

const submitDisabled = ref<boolean>(true)

const formValues = reactive<RegistrationFormValues>({
  email: ref<string>(''),
  password: ref<string>(''),
  confirmPassword: ref<string>('')
})

const formErrors = reactive<AuthenticationFormErrors>({
  passwordError: ref<boolean>(false),
  confirmPasswordError: ref<boolean>(false)
})

// Observe the values of the form - check for errors and store them.
// Also toggles the submit buttons state.
watch(formValues, (newState) => {
  submitDisabled.value = true
  formErrors.passwordError = (newState.password.length > 0 && newState.password.length < 8)
  formErrors.confirmPasswordError = (newState.confirmPassword !== newState.password)
  
  // If the password & email aren't empty
  if (formValues.password.length && formValues.email.length) {
    // if there are no current errors then allow submission
    if (!formErrors.passwordError && !formErrors.confirmPasswordError) {
      submitDisabled.value = false
    }
  } 
})

function submitRegistration() {
  RegisterWithEmail()
}
</script>

<style lang="scss">
.register-form {
  width: 100%;
  padding: toRem(16);

  h1 {
    @include body-large;
  }

  .button-container {
    padding: toRem(10) 0;
    display: flex;

    justify-content: space-between;
    gap: 8px;
  }
}
</style>