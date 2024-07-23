<script setup lang="ts">
import UserNav from '@components/Dashboard/UserNav.vue'
import AdminProducts from '@/components/views/admin/products/AdminProducts.vue';


</script>

<template>
    <div class="flex bg-accent">

          <aside
              class="w-52 m-6 mr-0 flex rounded flex-col  bg-gradient-to-b from-primary/70 to-primary text-white"
          >
            <h1 class="uppercase tracking-widest text-center text-2xl pt-8">
              APAGNAIN
            </h1>
            <nav class="px-4 pt-8 w-full grow">
              <ul class="flex flex-col justify-center items-start gap-y-4 w-full">
                <li class="w-full">
                
                    <span class="flex items-center gap-x-2 hover:bg-primary bg-primary hover:text-white rounded-sm px-3 py-2 text-white">
                        <ion-icon name="cube-outline"></ion-icon>
                        Produit
                    </span>
                </li>
              </ul>
            </nav>
          </aside>
          <div class="overflow-y-auto grow h-screen flex flex-col w-full ">
            <div class="pt-6 pr-3">
              <div class="flex h-16 items-center px-4">
                <TeamSwitcher />
                <MainNav class="mx-6" />
                <div class="ml-auto flex items-center space-x-4">
                  <UserNav />
                </div>
              </div>
            </div>
            <div class="h-1/5 w-full flex flex-col justify-center px-6 pb-6">
              <h1 class="text-4xl tracking-widest">
                Produits
              </h1>
            </div>

            <div class="grow pb-12 ">
                <AdminProducts />
            </div>
          </div>

    </div>
</template>
