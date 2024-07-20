<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import type { Upload, Collection } from '@types';
import {computed} from "vue";

import NotificationMenu from "@components/Menus/NotificationMenu.vue";



const props = defineProps<{
    id: number,
    name: string,
    shortDescription?: string,
    price?: number,
    image?: Upload,
    slug: string,
    collection?: Collection
    height?: string
}>()

const _slug = computed(()=>{
  return props.collection ? `/collections/${props.collection.slug}/products/${props.slug}` : `/collections/${props.slug}`
})

</script>

<template>
    <article class="flex-col w-full relative">
      <div class="absolute z-20 right-0 top-0">
        <NotificationMenu :id="props.id" :model-type="collection ? 'product': 'collection'" />
      </div>

        <div class="w-full bg-transparent overflow-hidden" :style="{
            height: props.height ?? '470px'
        }">
            <img v-if="props.image"
                :src="'/src/' + props.image.path"
                alt="product image"
                class="w-full h-full object-cover"
            />

            <div v-else class="relative h-full w-full">
                <img 
                    src="/src/assets/images/noPhotoAvailable.webp"
                    alt="product image"
                    class="w-full h-full object-cover relative"
                />
                <div class="absolute top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center overflow-hidden">
                    <p class="text-white text-4xl -rotate-45 tracking-widest uppercase">Image non <br/>disponible</p>
                </div>
            </div>
        </div>
        <div class="flex justify-between p-4">
            <div class="flex flex-col gap-2">
                <slot name="title">
                  <h3 class="font-medium text-lg">{{ props.name }}</h3>
                  <p class="text-slate-500 truncate w-[230px]">{{ props.shortDescription }}</p>
                </slot>
            </div>

            <div class="text-lg flex flex-col justify-end font-bold" v-if="props.price">
              <slot name="price">
                <p>{{ props.price }}€</p>
              </slot>
            </div>
        </div>
      <RouterLink :to="_slug">
        <slot name="action">
            <Button class="hover:text-primary transition uppercase" variant="ghost">
              Découvrir ce nain
              <ion-icon name="chevron-forward-outline" class="text-lg ml-4"/>
            </Button>
        </slot>
      </RouterLink>
    </article>
</template>

<style scoped>
article img{
  transition: transform 0.3s;
}
article:hover img{
  transform: scale(1.1);
}
</style>