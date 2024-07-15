<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import type { Upload, Collection } from '@types';

const props = defineProps<{
    name: string,
    shortDescription: string,
    price: number,
    image?: Upload,
    slug: string,
    collection: Collection
}>()
</script>

<template>
    <article class="flex-col w-[366px]">
        <div class="w-[366px] h-[471px] bg-primary">
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
                <div class="absolute top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center">
                    <p class="text-white text-4xl -rotate-45 tracking-widest uppercase">Image non <br/>disponible</p>
                </div>
            </div>
        </div>
        <div class="flex justify-between mb-2">
            <div class="flex flex-col">
                <h1 class="text-[#C9C9C9]">{{ props.name }}</h1>
                <h2>{{ props.shortDescription }}</h2>
            </div>

            <div class="text-lg flex flex-col justify-end">
                <p>{{ props.price }}€</p>
            </div>
        </div>
        <RouterLink :to="'/collections/' + collection.slug + '/products/'+ slug ">
            <Button class="w-full uppercase tracking-wider">Ce nain m'intéresse</Button>
        </RouterLink>
    </article>
</template>
