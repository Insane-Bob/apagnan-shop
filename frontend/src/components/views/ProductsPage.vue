<script setup lang="ts">
import SmallProductCard from '@components/cards/SmallProductCard.vue';
import Slider from '@components/ui/slider/Slider.vue';
import { reactive } from 'vue';

const selectedColor = reactive([]);
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'white', 'grey', 'brown'];

const price = reactive({
  min:0, 
  max: 1000
});

const addColor = (color: string) => {
  if (selectedColor.includes(color)) {
    selectedColor.splice(selectedColor.indexOf(color), 1);
  } else {
    selectedColor.push(color);
  }
};

const updatePrice = (values: number[] | undefined) => {
  price.min = values? values[0]: 0
  price.max = values? values[1]: 1000
    if(price.min > price.max) {
      let temp = price.min;
      price.min = price.max;
      price.max = temp;
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
          <Slider :modelValue="[price.min, price.max]" :onUpdate:modelValue="(values) => updatePrice(values)" :min="0" :max="1000" :step="1" :defaultValue="[0, 1000]" />
          <div class="flex justify-between">
            <p>{{ price.min }}€</p>
            <p>{{ price.max }}€</p>
            </div>
        </div>

        <hr class="border-primary border-t-2 my-2" />

        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-bold">Collection</h2>
          <select class="w-full">
            <option value="nain'ble">Nain'ble</option>
            <option value="nain'cool">Nain'cool</option>
            <option value="nain'génieux">Nain'génieux</option>
            <option value="nain'génial">Nain'génial</option>
          </select>
        </div>

        <hr class="border-primary border-t-2 my-2" />

        <div class="flex flex-col gap-2">
          <h2 class="text-lg font-bold">Couleur(s)</h2>
          <div class="flex flex-wrap gap-3">
            <div v-for="color in colors" :key="color" @click="addColor(color)" :class="`w-6 h-6 rounded-full  cursor-pointer ${color === 'white' ? 'border border-black' : ''} ${selectedColor.includes(color) ? 'outline outline-2 outline-offset-2 outline-primary' : ''}`" :style="{ backgroundColor: color }"></div>
          </div>
        </div>
      </div>

    </div>

    <SmallProductCard v-for="index in 9" :key="index" name="Nain'Garde" collection="Nain'ble" :price="1900 + (11 * index)" image="/src/assets/images/green-gnome.png" />
  </div>
</template>