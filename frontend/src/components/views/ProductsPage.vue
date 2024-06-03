<script setup lang="ts">
import SmallProductCard from '@components/cards/SmallProductCard.vue';
import Slider from '@components/ui/slider/Slider.vue';
import { reactive, ref } from 'vue';

interface ProductFilter {
  keyword: string;
  price: {
    min: number;
    max: number;
  };
  collection: string[];
  color: string[];
}

const filters: ProductFilter = reactive({
  keyword: '',
  price: {
    min: 0,
    max: 1000
  },
  collection: [],
  color: []
});

const extendCollection = ref(false);

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'white', 'grey', 'brown'];

const collections = ['nain\'straunote 2024', 'nain\'ble', 'nain\'gare', 'nain\'capable', 'nain\'vulnérable', 'nain\'vain', 'nain\'vivable', 'nain\'vendable', 'nain\'vaincu', 'nain\'vainqueur']

const addColor = (color: string) => {
  if (filters.color.includes(color)) {
    filters.color.splice(filters.color.indexOf(color), 1);
  } else {
    filters.color.push(color);
  }
};

const addCollection = (collection: string) => {
  if (filters.collection.includes(collection)) {
    filters.collection.splice(filters.collection.indexOf(collection), 1);
  } else {
    filters.collection.push(collection);
  }
};

const updatePrice = (values: number[] | undefined) => {
  filters.price.min = values? values[0]: 0
  filters.price.max = values? values[1]: 1000
    if(filters.price.min > filters.price.max) {
      let temp = filters.price.min;
      filters.price.min = filters.price.max;
      filters.price.max = temp;
    }
};

</script>

<template>
  <div class="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 px-12 lg:px-32 mt-24 pt-12 justify-items-center">
    <div id="filters" class="row-span-5 sm:row-span-5 lg:row-span-3 sticky top-24 self-start" >
      <h1 class="text-2xl font-bold">Filtres</h1>
      <div class="flex flex-col gap-5 mt-5">

        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-bold">Mot-clé</h2>

          <div class="relative">
            <input type="text" class="w-full p-1 border border-gray-300 rounded-md pr-0 md:pr-8" placeholder="Recherchez un Produit, une Collec..">
                <ion-icon class="absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1/2 z-20 hidden md:block" name="search-outline"></ion-icon>
          </div>

        </div>

        <hr class="border-primary border-t-2 my-2" />

        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-bold">Prix</h2>
          <Slider :modelValue="[filters.price.min, filters.price.max]" :onUpdate:modelValue="(values) => updatePrice(values)" :min="0" :max="1000" :step="1" :defaultValue="[0, 1000]" />
          <div class="flex justify-between">
            <p>{{ filters.price.min }}€</p>
            <p>{{ filters.price.max }}€</p>
            </div>
        </div>

        <hr class="border-primary border-t-2 my-2" />

        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-bold">Collection(s)</h2>
          <div class="flex flex-col gap-y-1">
            <div @click="addCollection(collection)" class="flex gap-x-3 items-center w-min whitespace-nowrap cursor-pointer" v-for="(collection, index) in extendCollection?collections:collections.slice(0,4)" :key="index">
              <ion-icon name="checkbox" v-if="filters.collection.includes(collection)"></ion-icon>
              <ion-icon name="square-outline" v-else></ion-icon>
              <label :for="collection" class="cursor-pointer">{{ collection }}</label>
            </div>
            <div @click="extendCollection = !extendCollection" class="flex items-center gap-x-2 cursor-pointer">
              <ion-icon :name="extendCollection?'chevron-up-outline':'chevron-down-outline'"></ion-icon>
              <p>{{ extendCollection?'Réduire':'Voir plus' }}</p>
            </div>
          </div>
        </div>

        <hr class="border-primary border-t-2 my-2" />

        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-bold">Couleur(s)</h2>
          <div class="flex flex-wrap gap-3">
            <div v-for="color in colors" :key="color" @click="addColor(color)" :class="`w-6 h-6 rounded-full  cursor-pointer ${color === 'white' ? 'border border-black' : ''} ${filters.color.includes(color) ? 'outline outline-2 outline-offset-2 outline-primary' : ''}`" :style="{ backgroundColor: color }"></div>
          </div>
        </div>
      </div>

    </div>

    <SmallProductCard v-for="index in 9" :key="index" name="Nain'Garde" collection="Nain'ble" :price="1900 + (11 * index)" image="/src/assets/images/green-gnome.png" />
  </div>
</template>

<style scoped>
[name="checkbox"] {
  color: hsl(var(--primary));
}
</style>