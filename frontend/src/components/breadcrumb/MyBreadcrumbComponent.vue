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
          <RouterLink :to="link[1]" @click.stop>
            <BreadcrumbLink as="span">{{ link[0] }}</BreadcrumbLink>
          </RouterLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < links.length - 1"> / </BreadcrumbSeparator>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
