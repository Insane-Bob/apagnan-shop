<script setup lang="ts">
import Button from '../ui/button/Button.vue';


let isOnTop = true;
  



function changeBrightness() {
  const mainShopPage = document.querySelector('.main-shop-page');
  const mainTitle = document.querySelector('.main-title');
  const mainHeader = document.querySelector('.main-header');
  const HeaderIcons = document.querySelectorAll('.header-icon');
  const headerTitle = document.querySelector('.header-title');
  if (mainShopPage) {
    mainShopPage.classList.toggle('brightness-50');
  }

  if (mainTitle) {
    mainTitle.classList.toggle('opacity-75');
    mainTitle.classList.toggle('opacity-0');
  }

  if (mainHeader) {
    mainHeader.classList.toggle('bg-white');
    mainHeader.classList.toggle('bg-transparant');
  }

  if (HeaderIcons) {
    HeaderIcons.forEach((icon) => {
      icon.classList.toggle('text-black');
      icon.classList.toggle('text-white');
    });
  }

  if (headerTitle) {
    headerTitle.classList.toggle('opacity-0');
  }
}

const onOpenBurgerMenu = () => {
  alert('open burger menu');
};

const scrollFunction = () => {

  if((document.body.getBoundingClientRect()).top < 0) {
    if(isOnTop) {
      console.log("test")
      isOnTop = false;
      changeBrightness();
    }
  } else {
    if(!isOnTop) {
      isOnTop = true;
      changeBrightness();
    }
    
  }
  // const mainHeader = document.querySelector('.main-header');
  // if (mainHeader) {
  //   if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
  //     changeBrightness();
  //   } else {
  //     changeBrightness();
  //   }
  // }
};

window.addEventListener('scroll', scrollFunction);

</script>

<template >
  <div v-on:scroll="scrollFunction" class="flex flex-col h-full">
    <div class="h-screen flex flex-col justify-between items-center pt-[10%] pb-20 ">
      <img src="/src/assets/images/main-gnome.webp" alt="Main Gnome" class="main-shop-page object-cover absolute top-0 h-screen w-screen brightness-50 -z-10" />
      
      <header class="main-header fixed top-0 h-24 bg-transparant w-full z-20 flex justify-end items-center px-4 md:px-20">
        <p class="header-title tracking-widest uppercase text-black font-bold text-xl md:text-4xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-0">Apagnain</p>
        <nav class="flex justy-center gap-x-6">
          <ion-icon name="cart-outline" class="header-icon text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"></ion-icon>
          <ion-icon name="person-outline" class="header-icon text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"></ion-icon>
          <ion-icon name="search-outline" class="header-icon text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"></ion-icon>
          <div @click="onOpenBurgerMenu()" class="header-icon flex items-center justify-center gap-x-3 cursor-pointer group text-white ">
            <ion-icon name="menu-outline" class="text-2xl group-hover:scale-105 duration-100"></ion-icon>
            <p class="group-hover:scale-105 hidden md:block duration-100">Menu</p>
          </div>
        </nav>
      </header>
      <h1 class="main-title uppercase mt-12 md:mt-0 text-white font-bold text-4xl md:text-[160px] opacity-75">Apagnain</h1>

      <div class="flex flex-col justify-center items-center gap-y-3">
        <p class="text-white text-lg md:text-[20px] uppercase">Nain’TERstellar 2024</p>
        <Button variant="secondary" class="uppercase" v-on:click="changeBrightness()">Découvrir la collection</Button>
      </div>
    </div>

    <div id="shop" class="w-screen h-screen bg-white py-14 px-24 grid col-span-3 gap-20">
      <article class="flex-col">
        <div class="w-[366px] h-[471px] bg-red-400"></div>
        <div class="flex flex-col">
          <h1 class="text-[#C9C9C9]">Nain’Ventif 2024</h1>
          <h2>Le Nain’Ble</h2>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.main-shop-page {
 transition: all 1s;
}

.main-title {
 transition: all 1s;
 letter-spacing: 0.1em;
 animation: forwards 1s ease-in-out 0s 1 spaceLetters;
}

.main-header {
 transition: all 1s;
}

.header-icon {
 transition: all 1s;
}

.header-title {
 transition: all 1s;
}

@keyframes spaceLetters {
  0% {
    letter-spacing: 0em;
  }
  100% {
    letter-spacing: 0.2em;
  }
}
</style>
