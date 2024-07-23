<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from 'vue'
import { apiClient } from '@/lib/apiClient'
import { useFilters } from '@/composables/useFilters'
import { useRouter } from 'vue-router'
import Slider from '@components/ui/slider/Slider.vue'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@components/ui/card";
import {Input} from "@components/ui/input";
import FormInput from "@components/Inputs/FormInput.vue";
import {Checkbox} from "@components/ui/checkbox";
import {Separator} from "@components/ui/separator";

const router = useRouter()
const isOpen = ref(false)
const firstSearch = ref('')
const tempSearch = ref('')
const cooldown = ref(false)
const collections = ref([])

const products = defineModel('products', {
    type: Array,
    default: [],
})

const { filters, query } = useFilters({
    priceMin: 0,
    priceMax: 2500,
    collection: '',
    color: '',
    s: '',
    onlyInStock: false,
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

const fetchDataForFilter = async () => {
    try {
        const response = await apiClient.get('/collections')
        collections.value = response.data.data
    } catch (e) {
        collections.value = []
    }
}

const updatePrice = (values) => {
    if (cooldown.value) {
        clearTimeout(cooldown.value)
    }
    cooldown.value = setTimeout(() => {
        filters.priceMin = values[0]
        filters.priceMax = values[1]
        cooldown.value = false
    }, 200)
}

const addCollection = (collectionId) => {
    const currentCollections = filters.collection
        .split(',')
        .filter((c) => c !== '')
    if (currentCollections.includes(collectionId.toString())) {
        filters.collection = currentCollections
            .filter((id) => id !== collectionId.toString())
            .join(',')
    } else {
        currentCollections.push(collectionId.toString())
        filters.collection = currentCollections.join(',')
    }
}

const addColor = (color) => {
    const currentColors = filters.color.split(',').filter((c) => c !== '')
    if (currentColors.includes(color)) {
        filters.color = currentColors.filter((c) => c !== color).join(',')
    } else {
        currentColors.push(color)
        filters.color = currentColors.join(',')
    }
}

async function buildFilters() {
    const urlParams = new URLSearchParams(window.location.search)
    filters.priceMin = urlParams.get('priceMin') || 0
    filters.priceMax = urlParams.get('priceMax') || 2500
    filters.collection = urlParams.get('collection') || ''
    filters.color = urlParams.get('color') || ''
    filters.s = urlParams.get('s') || ''
    firstSearch.value = urlParams.get('s') || ''
    filters.onlyInStock = urlParams.get('onlyInStock') || false
}

async function fetch() {
    router.push({ query: filters })
    try {
        const search = query.value.toString()
        const response = await apiClient.get('/search/products?' + search)
        products.value = response.data
    } catch (e) {
        products.value = []
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
    fetchDataForFilter()
    buildFilters()

})
</script>

<template>
  <div class="space-y-6 col-span-1 sticky top-24 self-start" id="filters">
    <Card>
      <CardHeader>
        <CardDescription>Mot-clé</CardDescription>
        <FormInput>
          <template #input>
            <Input v-model="firstSearch"  @input="handleSearch" />
          </template>
          <template #after-input>
            <ion-icon
                class="hidden md:block"
                name="search-outline"
            ></ion-icon>
          </template>
        </FormInput>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardDescription>Stock</CardDescription>
        <div class="flex gap-2 items-center">
          <Checkbox
              type="checkbox"
              id="onlyInStock"
              @update:checked="(e)=> filters.onlyInStock = e"
              :checked="filters.onlyInStock"
          />
          <label for="onlyInStock">En stock</label>
        </div>

        <Separator class="my-4"/>

        <CardDescription>Prix</CardDescription>
        <Slider
            :modelValue="[filters.priceMin, filters.priceMax]"
            :onUpdate:modelValue="(values) => updatePrice(values)"
            :min="0"
            :max="2500"
            :step="1"
            :defaultValue="[0, 2500]"
        />
        <div class="flex justify-between">
          <p>{{ filters.priceMin }}€</p>
          <p>{{ filters.priceMax }}€</p>
        </div>

        <Separator class="my-4"/>

        <CardDescription>Collection(s)</CardDescription>

        <div class="flex flex-col gap-y-1 max-h-[250px] overflow-y-auto overflow-x-hidden">
          <div
              @click="addCollection(collection.id)"
              class="flex gap-x-3 items-center w-min whitespace-nowrap cursor-pointer"
              v-for="collection in collections"
              :key="collection.id"
          >
            <ion-icon
                name="checkbox"
                v-if="
                                filters?.collection
                                    ?.split(',')
                                    ?.includes(collection.id.toString())
                            "
            ></ion-icon>
            <ion-icon name="square-outline" v-else></ion-icon>
            <label :for="collection.id" class="cursor-pointer">{{
                collection.name
              }}</label>
          </div>
        </div>

        <Separator class="my-4"/>

        <CardDescription>Couleur(s)</CardDescription>
        <div class="flex flex-wrap gap-3">
          <div
              v-for="color in colors"
              :key="color"
              @click="addColor(color)"
              :class="`w-6 h-6 rounded-full  cursor-pointer ${color === 'white' ? 'border border-black' : ''} ${filters.color.includes(color) ? 'outline outline-2 outline-offset-2 outline-primary' : ''}`"
              :style="{ backgroundColor: color }"
          ></div>
        </div>

      </CardHeader>
    </Card>
  </div>

</template>

<style scoped>
[name='checkbox'] {
    color: hsl(var(--primary));
}
</style>
