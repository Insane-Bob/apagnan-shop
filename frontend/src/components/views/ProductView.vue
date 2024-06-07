<script setup lang="ts">
import MyBreadcrumbComponent from '@/components/breadcrumb/MyBreadcrumbComponent.vue'
import ProductPictureCarousel from '@/components/product/ProductPictureCarousel.vue'
import ReviewNoteComponent from '@/components/product/ReviewNoteComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import SpecificsListComponent from '@/components/product/SpecificsListComponent.vue'
import FeaturedProductsCarousel from '@/components/product/FeaturedProductsCarousel.vue'

const breadcrumbLinks = [
  ['Accueil', '#'],
  ['Collections', '#'],
  ['Summer 2024', '#'],
  ['Nainguigui', '#']
]

const carouselImages = [
  '/src/assets/images/green-gnome.png',
  '/src/assets/images/profileMe.webp',
  '/src/assets/images/commandesListe.webp'
]

const product = {
  name: 'Nainguigui',
  note: 4,
  nbReviews: 12,
  price: 1100,
  modele: '24052024NGG 3',
  description:
    "Une pièce maîtresse exceptionnelle qui transcende les conventions de l'art de jardin. Fabriqué à la main par des artisans renommés, ce nain de jardin n'est pas seulement une décoration, mais une véritable œuvre d'art qui ajoutera une touche de sophistication et de charme à votre espace extérieur."
}

const specifics = [
  { name: 'Poids', content: '17 kg' },
  { name: 'Fabrication', content: 'Française' },
  { name: 'Matériaux', content: 'Résine de haute qualité;Peinture écologique' },
  { name: 'Finitions', content: 'Peint à la main;Détails en métal plaqué;Yeux en verre artisanal' },
  { name: 'Hauteur', content: '98 cm' },
  { name: 'Largeur', content: '22 cm' },
  { name: 'Etanchéité', content: 'Résistant aux intempéries;Résistant aux UV' }
]
</script>

<template>
  <div class="">
    <div class="h-80 flex items-center justify-center">
      <!-- TODO URL to collection Featured Images -->
      <img src="/src/assets/images/main-gnome.webp" class="w-full h-full object-cover" />
    </div>
    <div class="w-full h-14 mb-10">
      <MyBreadcrumbComponent :links="breadcrumbLinks" />
    </div>
    <div class="flex justify-center">
      <div class="w-4/5 flex justify-center gap-16 mb-16">
        <ProductPictureCarousel :imageUrls="carouselImages" />
        <div class="w-1/2 flex flex-col gap-14">
          <h1 class="text-3xl font-bold font-title">{{ product.name }}</h1>
          <ReviewNoteComponent :note="product.note" :NbReviews="product.nbReviews" />
          <p class="text-2xl font-semibold">€ {{ product.price }}</p>
          <div class="flex flex-col gap-3">
            <h2 class="font-semibold text-xl">Détail du produit</h2>
            <p class="text-slate-400">Modèle {{ product.modele }}</p>
            <p>{{ product.description }}</p>
          </div>
          <div class="flex gap-4">
            <Button>Acheter maintenant</Button>
            <Button variant="outline">Ajouter au panier</Button>
          </div>
          <div class="text-slate-400 flex items-center gap-2">
            En savoir plus <ion-icon name="arrow-down-outline"></ion-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mb-24">
      <div class="w-4/5 flex gap-16 flex-col items-center">
        <h2 class="text-2xl font-semibold">Caractéristiques</h2>
        <SpecificsListComponent :specifics="specifics" />
      </div>
    </div>
    <div class="flex justify-center mb-7">
      <div class="w-4/5 flex gap-16 flex-col items-center">
        <h2 class="text-2xl font-semibold uppercase">Vous aimerez aussi</h2>
        <FeaturedProductsCarousel />
      </div>
    </div>
  </div>
</template>
