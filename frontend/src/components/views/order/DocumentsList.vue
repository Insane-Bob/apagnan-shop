<template>
    <Card>
        <CardHeader>
            <CardDescription> Documents </CardDescription>
        </CardHeader>
        <CardContent class="flex gap-3">
            <a
                v-for="document in documents"
                :key="document.id"
                :href="document.file"
                target="_blank"
                download
                class="flex flex-col items-center justify-center p-3 w-[150px] transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer border border-gray-200 rounded-lg"
            >
                <ion-icon
                    name="document-outline"
                    class="text-[3rem] text-primary"
                ></ion-icon>
                <div class="flex items-center">
                    <span class="inline-block mt-3 text-slate-500 text-xs">
                        {{ documentTranslated[document.type] }}
                    </span>
                    <ion-icon
                        name="download-outline"
                        class="text-primary mt-3 ml-2"
                    ></ion-icon>
                </div>
            </a>
        </CardContent>
    </Card>
</template>

<script setup>
import { Card, CardHeader, CardContent, CardDescription } from '../../ui/card'
import { useFetch } from '../../../composables/useFetch'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    order: {
        type: Object,
        default: () => ({}),
    },
})

const documentTranslated = ref({
    invoice: 'Facture',
    creditNote: "Facture d'avoir",
})

const documents = ref([])
const fetch = useFetch(computed(() => `/orders/${props.order.id}/invoices`))

onMounted(async () => {
    try {
        documents.value = await fetch.get()
    } catch (e) {
        documents.value = []
    }
})
</script>
