<script setup lang="ts">
import ProductCard2 from '@components/Cards/ProductCard2.vue'
import SearchProduct from '@components/product/SearchProduct.vue'
import { ref } from 'vue'

const products = ref([])

</script>

<template>
    <div
        class="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 px-12 lg:px-32 mt-12 pt-12 justify-items-center"
    >
        <SearchProduct v-model:products="products" />
        <div v-if="!products.length" class="text-center text-2xl font-bold">
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
</template>
