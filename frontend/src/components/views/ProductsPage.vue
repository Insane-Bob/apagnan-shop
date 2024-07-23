<script setup lang="ts">
import ProductCard2 from '@components/Cards/ProductCard2.vue'
import SearchProduct from '@components/product/SearchProduct.vue'
import { onBeforeMount, onUpdated, reactive, ref } from 'vue'

// Simulate a loading time of 2 seconds
/* onBeforeMount(() => {
    setTimeout(() => {
        loading.value = false
    }, 2000)
}) */
</script>

<template>
    <div
        class="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 px-12 lg:px-32 mt-24 pt-12 justify-items-center"
    >
        <SearchProduct />
        <!--<ProductCard2
            height="300px"
            v-for="product in collection.Products"
            :key="product.id"
            :name="product.name"
            :slug="product.slug"
            :collection="collection"
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
        </ProductCard2> -->
    </div>
</template>
