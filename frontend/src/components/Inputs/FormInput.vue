<template>
  <div>
    <Label
      v-if="$slots.label"
      :for="id"
      class="mb-1 h-4 block text-xs text-zinc-800 font-medium first-letter:uppercase whitespace-nowrap"
    >
      <slot name="label" />
      <span v-if="required" class="text-red-500">{{ ' *' }}</span>
    </Label>

    <!-- @TODO : Add a great color for the focus-within of the input -->
    <div
      class="relative flex items-center gap-2 text-sm"
      :class="{
        'border border-zinc-300 focus-within:border-primary': !noBorder, 
        'bg-white': !disabled,
        'bg-neutral-100': disabled
      }"
    >
      <div
        v-if="$slots['before-input']"
        class="ms-2 text-xs text-zinc-800/50 whitespace-nowrap"
        @click="focusInput()"
      >
        <slot name="before-input" />
      </div>
      <slot
        name="input"
        :id="id"
        :ref="setRef"
        :required="required"
        :disabled="disabled"
        class="h-10 w-full bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-within:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div  
        v-if="$slots['after-input']"
        class="me-2 text-xs text-zinc-800/50 whitespace-nowrap"
        @click="focusInput()"
      >
        <slot name="after-input" />
      </div>
    </div>

    <FormError v-if="$slots.error || error">
      <slot name="error">
        {{ error }}
      </slot>
    </FormError>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Label from '@/components/ui/label/Label.vue'
import FormError from '@/components/Forms/FormError.vue'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: () => ''
  },
  disabled: {
    type: Boolean,
    default: () => false
  },
  required: {
    type: [Boolean, Number],
    default: () => false
  },
  error: {
    type: String,
    default: () => null
  },
  noBorder: {
    type: Boolean,
    default: () => false
  }
})

const id = (Math.random() + 1).toString(36).substring(2)
const inputRef = ref()

defineExpose({
  focus: () => inputRef.value?.focus?.(),
  blur: () => inputRef.value?.blur?.()
})

function setRef(element) {
  if (element) {
    inputRef.value = element
  }
}

function focusInput() {
  inputRef.value?.focus?.()
}
</script>
