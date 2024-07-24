<script setup lang="ts">
import { ApiClient } from '@/lib/apiClient'
import { useRoute, useRouter } from 'vue-router'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { onMounted, ref } from 'vue'

const route = useRoute()
const router = useRouter()

const page = ref(null)
async function fetchPage() {
    let client = new ApiClient()
    try {
        const { data } = await client.get(
            '/legals-documents/' + route.params.slug,
        )
        page.value = data
    } catch (e) {
        router.push('/notFound')
    }
}
onMounted(fetchPage)
</script>

<template>
    <div
        v-if="page"
        class="bg-slate-100 py-6 min-h-[90vh] flex flex-col items-center"
    >
        <div class="max-w-[800px] w-[100%] grow bg-white px-8 pb-12">
            <MdPreview :modelValue="page.content" />
        </div>
    </div>
</template>

<style scoped></style>
