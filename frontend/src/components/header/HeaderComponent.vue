<script setup lang="ts">

const onOpenBurgerMenu = () => {
  alert('open burger menu');
};

</script>

<template>
    <header class="main-header fixed top-0 h-24 bg-white w-full z-40 flex justify-end items-center px-4 md:px-20">
        <RouterLink to="/">
          <p class="header-title tracking-widest uppercase text-black font-bold text-xl md:text-4xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">Apagnain</p>
        </RouterLink>
        <nav class="flex justy-center gap-x-6">
          <ion-icon name="cart-outline" class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100  hidden md:block"></ion-icon>
          <ion-icon name="person-outline" class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100  hidden md:block"></ion-icon>
          <ion-icon name="search-outline" class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100  hidden md:block"></ion-icon>
          <div @click="onOpenBurgerMenu()" class="header-icon flex items-center justify-center gap-x-3 cursor-pointer group text-black ">
            <ion-icon name="menu-outline" class="text-2xl group-hover:scale-105 duration-100"></ion-icon>
            <p class="group-hover:scale-105 duration-100  hidden md:block">Menu</p>
          </div>
        </nav>
      </header>
</template>