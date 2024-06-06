<script setup lang="ts">
import Button from '@components/ui/button/Button.vue';

const props = defineProps<{
    page: {
        current: number;
        total: number;
        perPage: number;
    }
}>();

const emit = defineEmits(['emitNextPage', 'emitPreviousPage'])

function onNextPage() {
    emit('emitNextPage');
}

function onPreviousPage() {
    emit('emitPreviousPage');
}

</script>

<template>
      <div v-if="props.page" class="text-sm w-full flex justify-center items-center gap-x-3 mt-2">
            <button @click="onPreviousPage()" :class="{'text-gray-300 cursor-not-allowed':props.page.current === 1}"><ion-icon name="chevron-back-outline"></ion-icon></button>
            <button v-if="props.page.current > 1" @click="onPreviousPage()">{{ props.page.current-1 }}</button>
            <button class="bg-primary text-white h-6 w-6 rounded-sm">{{ props.page.current }}</button>
            <button v-if="props.page.current < props.page.total/props.page.perPage" @click="onNextPage()">{{ props.page.current+1 }}</button>
            <button @click="onNextPage()" :class="{'text-gray-300 cursor-not-allowed':props.page.current*props.page.perPage >= props.page.total}"><ion-icon name="chevron-forward-outline" ></ion-icon></button>
        </div>
</template>