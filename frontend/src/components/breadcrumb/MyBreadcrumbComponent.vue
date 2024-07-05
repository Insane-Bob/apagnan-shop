<script setup lang="ts">
import { defineProps } from 'vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

const props = defineProps({
  links: {
    type: Array,
    required: true
  },
  class: {
    type: String,
    required: false
  }
})

/* 
// Usage of the component
const breadcrumbLinks = [
  ['Accueil', '#'],
  ['Collections', '#'],
  ['Summer 2024', '#'],
  ['Nainguigui', '#']
]
<MyBreadcrumbComponent :links="breadcrumbLinks" /> */
</script>

<template>
  <Breadcrumb class="flex justify-center h-full bg-[#F0F0F0]" :class="props.class">
    <BreadcrumbList>
      <template v-for="(link, index) in props.links" :key="index">
        <BreadcrumbItem
          :class="{
            'text-primary': index === links.length - 1,
            'text-green-900': index !== links.length - 1
          }"
        >
          <BreadcrumbLink :href="link[1]">{{ link[0] }}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < links.length - 1"> / </BreadcrumbSeparator>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
