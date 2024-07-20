<script setup lang="ts">
import { defineProps } from 'vue'
import type { Review } from '@types'
import ReviewNoteComponent from './ReviewNoteComponent.vue'
import { Progress } from '@/components/ui/progress'

const props = defineProps<{
  reviews: Review[]
}>()



</script>

<template>
  <div class="flex gap-x-5" v-if="reviews.length > 0">
    <div class="flex flex-col items-center">
        <h1 class="text-4xl font-bold">{{ (props.reviews.reduce((acc, review) => acc + review.rate,
            0,
        ) / reviews.length).toPrecision(2) }}<span class="text-base font-light">/5</span></h1>

        <ReviewNoteComponent
            :note="
                reviews.reduce(
                    (acc, review) => acc + review.rate,
                    0,
                ) / reviews.length
            "
            :NbReviews="reviews.length"
            :detailled="true"
        />
        <span class="text-sm text-gray-500">({{ reviews.length }})</span>
    </div>

    <div class="flex flex-col-reverse gap-y-4 text-sm">
        <div v-for="index in 5" :key="index" class="flex justify-center items-center w-52 gap-x-3">
            <h1 class="text-sm flex justify-end items-center gap-x-1">
                {{ index }}
                <ion-icon name="star"></ion-icon>
            </h1>
            <Progress :model-value="reviews.filter((r): Review => r.rate === index).length / reviews.length * 100" class="w-full h-1/2" />
        </div>
    </div>
    
  </div>
</template>
