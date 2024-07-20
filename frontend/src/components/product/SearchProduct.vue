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
import { computed, ref, watch } from 'vue'
import { apiClient } from '@/lib/apiClient'

const isOpen = ref(false)
const search = ref('')
const tempSearch = ref('')
const cooldown = ref(false)
const data = ref([])

async function fetch() {
    try {
        const response = await apiClient.get(
            '/search/products?s=' + search.value,
        )
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
        search.value = tempSearch.value
        cooldown.value = false
    }, 200)
}

watch(search, fetch, { immediate: true })
</script>

<template>
    <div>
        <OutlinedInput
            type="search"
            placeholder="Search..."
            class="md:w-[100px] lg:w-[300px]"
            @mousedown="isOpen = true"
        />
        <CommandDialog
            :filterFunction="filterFunction"
            class="rounded-lg border shadow-md max-w-[450px]"
            v-model:open="isOpen"
        >
            <CommandInput
                placeholder="Type a command or search..."
                @input="handleSearch"
            />
            <CommandList>
                <CommandEmpty>No results found. {{ search }}</CommandEmpty>
                <CommandGroup heading="Produits">
                    <CommandItem :value="p.id" v-for="p in data.value">
                        <span>{{ p.name }}</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    </div>
</template>
