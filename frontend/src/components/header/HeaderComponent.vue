<script setup lang="ts">
import { onUnmounted, reactive } from 'vue';

const search = reactive({
  query: '',
  show: false,
});

const onOpenBurgerMenu = () => {
  alert('open burger menu');
};

const onSearch = () => {
  if(!search.show) {
    search.show = true;
    return;
  }

  alert(`searching for ${search.query}`);

};

</script>

<template>
    <header class="main-header fixed top-0 h-24 bg-white w-full z-40 flex justify-end items-center px-4 md:px-20">
        <RouterLink to="/">
          <p class="header-title tracking-widest uppercase text-black font-bold text-xl md:text-2xl lg:text-4xl absolute top-1/2 left-10 -translate-y-1/2 xl:left-1/2 xl:-translate-x-1/2">Apagnain</p>
        </RouterLink>
        <nav class="flex justy-center gap-x-6 items-center">
          <ion-icon name="cart-outline" class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100  hidden md:block"></ion-icon>
          <ion-icon name="person-outline" class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100  hidden md:block"></ion-icon>
          <form @submit.prevent="onSearch()" class="flex justify-center items-center -ml-6 gap-2 ">
            <input v-model="search.query" type="text" class="rounded-sm duration-300 px-2 py-1 max-w-44 " :class="{'w-0 border-0': !search.show, 'w-[30vw] border ml-2': search.show}" placeholder="Search..." />
            <button class="flex items-center"><ion-icon name="search-outline" class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100 "></ion-icon></button>
          </form>
          <div @click="onOpenBurgerMenu()" class="header-icon flex items-center justify-center gap-x-3 cursor-pointer group text-black ">
            <ion-icon name="menu-outline" class="text-2xl group-hover:scale-105 duration-100"></ion-icon>
            <p class="group-hover:scale-105 duration-100  hidden md:block">Menu</p>
          </div>
        </nav>
      </header>
</template>