// This file contains the types for the authentication process
import type { Ref } from 'vue'

export interface RegistrationFormValues {
  email: Ref<string>
  password: Ref<string>
  confirmPassword: Ref<string>
}

export interface AuthenticationFormErrors {
  emailError?: Ref<boolean>
  passwordError?: Ref<boolean>
  confirmPasswordError?: Ref<boolean>
}
