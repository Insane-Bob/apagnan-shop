<script setup lang="ts">
import { defineProps, computed } from 'vue'

interface Specific {
  name: string
  content: string
}

const props = defineProps<{
  specifics: Specific[]
}>()

const chunks = computed(() => {
  const chunkSize = 4
  const result = []
  for (let i = 0; i < props.specifics.length; i += chunkSize) {
    result.push(props.specifics.slice(i, i + chunkSize))
  }
  return result
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-24">
    <!-- gap-x-8 pour augmenter l'écart entre les colonnes -->
    <div v-for="(chunk, chunkIndex) in chunks" :key="chunkIndex" class="flex flex-col gap-y-3">
      <!-- gap-y-3 pour l'écart entre les lignes -->
      <div
        v-for="specific in chunk"
        :key="specific.name"
        class="flex justify-between items-start gap-10"
      >
        <p class="font-semibold">{{ specific.name }}</p>
        <div v-if="specific.content.includes(';')">
          <ul>
            <li v-for="(part, partIndex) in specific.content.split(';')" :key="partIndex">
              {{ part.trim() }}
            </li>
          </ul>
        </div>
        <p v-else>{{ specific.content }}</p>
      </div>
    </div>
  </div>
</template>
