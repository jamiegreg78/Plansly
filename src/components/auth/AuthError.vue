<template>
    <p  
    :class="{invalid: validity}"
    >
        {{ props.message }}
    </p>
</template>

<script setup lang="ts">
export interface ErrorMessageProps {
    message: string
    validity: boolean
}

const props = defineProps<ErrorMessageProps>()
</script>

<style lang="scss" scoped>
p {
    color: var(--gray)
}
.invalid {
    color: var(--error);
}
.valid {
    color: var(--primary);
}
</style>