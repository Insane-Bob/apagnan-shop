<script setup lang="ts">

import type {Collection} from "@/types";
import {computed, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import Section from "@/layout/Section.vue";
import {useFetch} from "@/composables/useFetch";
import Loader from "@components/ui/loader/Loader.vue";
import Button from "@components/ui/button/Button.vue";
import ProductCard2 from "@components/Cards/ProductCard2.vue";
import {useSuggestion} from "@/composables/useSuggestion";
import MyBreadcrumbComponent from "@components/breadcrumb/MyBreadcrumbComponent.vue";
import SuggestionCarousel from "@components/product/SuggestionCarousel.vue";
import NotificationMenu from "@components/Menus/NotificationMenu.vue";
import Newsletter from "@components/Newsletter/Newsletter.vue";


const route = useRoute()
const collectionSlug = computed(()=> route.params.cslug)
const url = computed(()=> `/collections/${collectionSlug.value}?withProducts=true`)

const {items:collections,fetch:fetchSuggestion} = useSuggestion<Collection>([collectionSlug.value],6)

const collection = ref<Collection | null>(null)
const fetcher = useFetch(url,null,  (data : any)=>{
  collection.value = data.collection
})

onMounted(fetcher.get)
watch(url,fetcher.get)
watch(url,fetchSuggestion)

const breadcrumbLinks = computed(()=>[
  ['Accueil', '/'],
  ['Collections', '/collections/les-nains-supportables'],
  [collection.value?.name, '#'],
])

</script>

<template>
  <loader :wait-for="collection">
    <main>
      <img v-if="collection?.image" :src="collection.image.path"
           class="w-full h-[30vh] sm:h-[35vh] lg:h-[40vh] object-top object-cover"
      >
      <div class="w-full h-14 mb-10">
      <MyBreadcrumbComponent :links="breadcrumbLinks" />
      </div>

      <Section class="relative">
        <div class="flex flex-wrap items-center justify-between">
        <div class="w-[100%] md:w-[25%]"></div>
        <h1 class="grow text-md uppercase font-medium text-center">{{collection.name}}</h1>
         <div class="w-[100%] md:w-[25%] flex justify-center md:justify-end">
           <NotificationMenu :id="collection.id" model-type="collection">
             <div class="flex items-center">
               <ion-icon name="notifications-outline" class="text-lg mr-3" />
               Gestion des alertes
             </div>
           </NotificationMenu>
           </div>
        </div>


        <div
            class="justify-items-center max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-12"
        >
          <ProductCard2
              height="300px"
              :key="product.id"
              v-for="product in collection.Products"
              :name="product.name"
              :slug="product.slug"
              :collection="collection"
              :shortDescription="product.description" :image="product?.images?.length ? product.images[0] : null">
            <template #action>
              <Button class="hover:text-primary transition uppercase" variant="ghost">
                Ce nain m'interesse
                <ion-icon name="chevron-forward-outline" class="text-lg ml-4"/>
              </Button>
            </template>

          </ProductCard2>
        </div>
      </Section>

      <Section class="bg-slate-100">
        <h1 class="text-md uppercase font-medium text-center">
          Vous aimerez aussi
        </h1>
        <div
            class="justify-items-center max-w-[1000px] mx-auto"
        >
          <SuggestionCarousel :suggestions="collections.map(c=>({...c,url:`/collections/${c.slug}`}))" >
            <template #item="{suggestion}">
              <ProductCard2
                  height="300px"
                  :key="suggestion.id"
                  :name="suggestion.name"
                  :slug="suggestion.slug"
                  :shortDescription="suggestion.description" :image="suggestion?.image">
                <template #action>
                  <Button class="hover:text-primary transition uppercase" variant="ghost">
                    Découvrir la collection
                    <ion-icon name="chevron-forward-outline" class="text-lg ml-4"/>
                  </Button>
                </template>
              </ProductCard2>
            </template>
          </SuggestionCarousel>
        </div>
      </Section>
      <Section class="max-w-[1000px] mx-auto">
        <h1 class="text-md uppercase font-medium text-center">
          Notre newsletter
        </h1>
        <Newsletter/>
      </Section>

    </main>
  </loader>

</template>

<style scoped>

</style>