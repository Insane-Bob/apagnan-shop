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
  },
  detailled: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
  <div class="flex items-center" v-if="props.NbReviews > 0">
    <ion-icon
      v-for="index in 5"
      :key="index"
      :name="index <= props.note ? 'star' : index - props.note>0 && index -props.note < 1?'star-half-outline':'star-outline'"
      class="text-primary text-xl"
    ></ion-icon>
    <p v-if="!detailled" class="text-sm text-gray-500 ml-2">({{ props.NbReviews }} Avis)</p>
  </div>
  <div class="flex items-center" v-else>
    <p class="text-sm text-gray-500">Pas d'avis</p>
  </div>
</template>
