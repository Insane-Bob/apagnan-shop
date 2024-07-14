<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  note: {
    type: Number,
    required: true
  },
  NbReviews: {
    type: Number,
    required: true
  }
})

</script>

<template>
  <div class="flex items-center">
    <ion-icon
      v-for="index in 5"
      :key="index"
      :name="index <= props.note ? 'star' : index - props.note>0 && index -props.note < 1?'star-half-outline':'star-outline'"
      class="text-black text-xl"
    ></ion-icon>
    <p class="text-sm text-gray-500 ml-2">({{ props.NbReviews }} Avis)</p>
  </div>
</template>
