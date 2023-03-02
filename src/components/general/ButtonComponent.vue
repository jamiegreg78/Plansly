<template>
  <button :disabled="props.disabled" class="button" :class="{ primary: props.isPrimary }" @click="emitClick">
    {{ props.text }}
  </button>
</template>

<script setup lang="ts">
export type ButtonProps = {
  text: string
  isPrimary?: boolean
  disabled?: boolean
}
const props = defineProps<ButtonProps>()

const emit = defineEmits(['clicked'])

function emitClick(event: Event) {
	//event.preventDefault()
	emit('clicked', event)
}
</script>

<style lang="scss">
.button {
  width: 100%;
  padding: toRem(8);

  @include button;

  border: 1px solid var(--border);
  border-radius: 8px;

  background-color: transparent;

  &:hover {
    cursor: pointer;
  }

  &.primary {
    background-color: var(--primary);
    color: var(--white);

    border-color: transparent;
  }
}
</style>
