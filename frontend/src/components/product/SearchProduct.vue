<script setup lang="ts">
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@components/ui/command'
import { onMounted, ref, watch } from 'vue'
import { apiClient } from '@/lib/apiClient'
import { useFilters } from '@/composables/useFilters'
import Checkbox from '../ui/checkbox/Checkbox.vue'
import { useRouter } from 'vue-router'
import { Building } from 'lucide-vue-next'

const router = useRouter()
const isOpen = ref(false)
const tempSearch = ref('')
const cooldown = ref(false)
const data = ref([])
const collections = ref([])

const { filters, query } = useFilters({
    priceMin: 0,
    priceMax: 1000,
    collection: [],
    color: [],
    s: '',
})

const colors = [
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'orange',
    'black',
    'white',
    'grey',
    'brown',
]

const fetchCollections = async () => {
    try {
        const response = await apiClient.get('/collections')
        collections.value = response.data.slice(0, 5)
        console.log(collections.value)
    } catch (e) {
        collections.value = []
    }
}

async function buildFilters() {
    const urlParams = new URLSearchParams(window.location.search)
    filters.priceMin = urlParams.get('priceMin') || 0
    filters.priceMax = urlParams.get('priceMax') || 1000
    filters.collection = urlParams.getAll('collection')
    filters.color = urlParams.getAll('color')
    filters.s = urlParams.get('s') || ''
}

async function fetch() {
    router.push({ query: filters })
    try {
        const search = query.value.toString()
        const response = await apiClient.get('/search/products?' + search)
        data.value = response.data
    } catch (e) {
        data.value = []
    }
}

function handleSearch(event) {
    tempSearch.value = event.target.value
    if (cooldown.value) {
        clearTimeout(cooldown.value)
    }
    cooldown.value = setTimeout(() => {
        filters.s = tempSearch.value
        cooldown.value = false
    }, 200)
}

watch(filters, fetch, { immediate: true })

onMounted(() => {
    buildFilters()
    fetchCollections()
})
</script>

<template>
    <div></div>
</template>
