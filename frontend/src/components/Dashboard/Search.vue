<script setup lang="ts">
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import Dialog from '@components/ui/dialog/Dialog.vue'
import DialogTrigger from '@components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@components/ui/dialog/DialogContent.vue'

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@components/ui/command'
import { computed, ref, watch } from 'vue'
import { ApiClient } from '@/lib/apiClient'
import {useRouter} from "vue-router";

const apiClient = new ApiClient()

const isOpen = ref(false)
const search = ref('')
const tempSearch = ref('')
const cooldown = ref(false)
const data = ref([])
async function fetch() {
    try {
        const response = await apiClient.get('/search?s=' + search.value)
        if (!Array.isArray(response?.data)) {
            data.value = []
        } else {
            data.value = response.data
        }
    } catch (e) {
        data.value = []
    }
}

const products = computed(() => {
    return data.value.filter((item) => item.type === 'product')
})

const orders = computed(() => {
    return data.value.filter((item) => item.type === 'order')
})

const users = computed(() => {
    return data.value.filter((item) => item.type === 'user')
})

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

function filterFunction(list, searchTerm) {
    return list.filter((item) => true)
}

watch(search, fetch, { immediate: true })

const router = useRouter()
function goToPage(route){
  router.push('/admin'+route)
  isOpen.value = false
}
</script>

<template>
    <div>
        <OutlinedInput
            type="search"
            placeholder="Rechercher..."
            class="md:w-[100px] lg:w-[300px]"
            @mousedown="isOpen = true"
        />
        <CommandDialog
            :filterFunction="filterFunction"
            class="rounded-lg border shadow-md max-w-[450px]"
            v-model:open="isOpen"
        >
            <CommandInput
                placeholder="Rechercher un produit, un utilisateur, une collections, etc..."
                @input="handleSearch"
            />
            <CommandList>
                <CommandEmpty>Pas de résultat. {{ search }}</CommandEmpty>
                <CommandGroup heading="Utilisateurs">
                    <CommandItem :value="u.id" v-for="u in users" @click="goToPage('/users?id='+u.id)">
                        <span>{{ u.firstName }} {{ u.lastName }}</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Commandes">
                    <CommandItem :value="o.id" v-for="o in orders" @click="goToPage('/orders?id='+o.id)">
                        <span
                            >#{{ o.id }} - {{ o.Customer.User.firstName }}
                            {{ o.Customer.User.lastName }}</span
                        >
                    </CommandItem>
                </CommandGroup>
                <CommandGroup heading="Produits">
                    <CommandItem :value="p.name" v-for="p in products" @click="goToPage('/products?id='+p.id)">
                        <span>{{ p.name }} - {{ p.Collection.name }}</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    </div>
</template>
