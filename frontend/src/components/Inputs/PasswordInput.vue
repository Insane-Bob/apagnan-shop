<template>
    <div>
        <FormInput
            :name="name"
            :errors="errors"
            :required="required"
            class="row-span-1 col-start-1 col-span-full"
        >
            <template #label>
                <slot name="label" />
            </template>
            <template #input="inputProps">
                <input
                    :type="passwordManager.inputType"
                    :value="modelValue"
                    @input="onInput"
                    v-bind="inputProps"
                />
            </template>
            <template #after-input>
                <ion-icon
                    :name="
                        passwordManager.isShown
                            ? 'eye-outline'
                            : 'eye-off-outline'
                    "
                    class="mr-2 h-4 w-4 cursor-pointer"
                    @click="passwordManager.toggle"
                ></ion-icon>
            </template>
        </FormInput>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import FormInput from '@/components/Inputs/FormInput.vue'

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    errors: {
        type: [Array, String],
        default: () => [],
    },
    required: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue'])

const passwordManager = reactive({
    isShown: false,
    inputType: computed(() => {
        return passwordManager.isShown ? 'text' : 'password'
    }),
    show() {
        passwordManager.isShown = true
    },
    hide() {
        passwordManager.isShown = false
    },
    toggle() {
        passwordManager.isShown = !passwordManager.isShown
    },
})

const onInput = (event) => {
    emit('update:modelValue', event.target.value)
}

const inputError = computed(() => {
    if (Array.isArray(props.errors)) {
        return props.errors.find((error) => error.path === props.name)
    }
    return null
})
</script>
