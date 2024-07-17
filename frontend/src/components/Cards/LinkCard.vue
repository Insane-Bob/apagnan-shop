<script setup lang="ts">


const props = defineProps<{
    name: string,
    shortDescription: string,
    link: string,
    image: string,
    to?: string,
}>();

</script>

<template>
    <RouterLink :to="to || '#'">
        <section class="max-w-[350px] flex flex-col justify-center gap-y-2 items-center cursor-pointer group hover:text-primary hover:transition-all">
            <div class="w-full overflow-hidden rounded-full mb-4">
                <img class="rounded-full aspect-square object-cover group-hover:scale-105 duration-300" :src="props.image" />
            </div>

                <h1 class="uppercase text-xl tracking-wider font-medium">{{ props.name }}</h1>
                <p class="text-sm font-normal text-center tracking-wider px-4 whitespace-pre">{{ props.shortDescription }}</p>
        </section>
    </RouterLink>
</template>