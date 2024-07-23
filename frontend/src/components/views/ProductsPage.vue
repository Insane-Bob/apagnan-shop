<script setup lang="ts">
import ProductCard2 from '@components/Cards/ProductCard2.vue'
import SearchProduct from '@components/product/SearchProduct.vue'
import { ref } from 'vue'
import {Button} from "@components/ui/button";

const products = ref([])

</script>

<template>
  <div class=" bg-slate-100 p-6">
    <div class="relative grid grid-cols-4 gap-6 max-w-[1200px] mx-auto">
        <SearchProduct v-model:products="products" />
        <div class="col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-if="!products.length" class="italic col-span-10 flex items-center text-slate-400 justify-center">
              Aucun résultat trouvé
          </div>
          <ProductCard2
              v-else
              height="300px"
              v-for="product in products"
              :key="product.id"
              :name="product.name"
              :slug="product.slug"
              :collection="product.Collection"
              :shortDescription="product.description"
              :image="product?.images?.length ? product.images[0] : null"
          >
              <template #action>
                  <Button
                      class="hover:text-primary transition uppercase"
                      variant="ghost"
                  >
                      Ce nain m'interesse
                      <ion-icon
                          name="chevron-forward-outline"
                          class="text-lg ml-4"
                      />
                  </Button>
              </template>
          </ProductCard2>
        </div>

    </div>
  </div>

</template>
