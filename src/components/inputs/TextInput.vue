<template>
  <div class="text-input-container">
    <label>{{ props.label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :class="{ error: props.hasError }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
export type TextInputProps = {
  label: string
  type: 'email' | 'password'
  modelValue: string
  hasError?: boolean
}

const props = defineProps<TextInputProps>()

defineEmits(['update:modelValue'])
</script>

<style lang="scss">
.text-input-container {
  width: 100%;
  margin-bottom: toRem(10);

  label {
    display: block;
    margin-bottom: toRem(4);

    @include regular-semibold;
    color: var(--gray);
  }

  input {
    width: 100%;
    border: 2px solid transparent;
    border-radius: 8px;

    font-size: 1rem;
    padding: toRem(12) toRem(10);

    background-color: var(--background-inset);

    &:focus {
      outline: 2px solid var(--primary);
    }
    
    &.error {
      background-color: var(--error-background);
      color: var(--error);

      &:focus {
        outline-color: var(--error);
      }
    }
  }
}
</style>
