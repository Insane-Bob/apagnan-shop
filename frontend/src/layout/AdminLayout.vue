<script setup lang="ts">
</script>

<template>
    <div class="flex">
        <aside class="w-48 bg-primary h-screen text-primary-foreground">
            <h1 class="uppercase tracking-wider text-center text-2xl pt-8">APAGNAIN</h1>
            <nav class="px-4 pt-8 w-full">
                <ul class="flex flex-col justify-center items-start gap-y-4 w-full">
                    <li class="w-full">
                        <router-link to="/admin/dashboard">
                            <span class="flex items-center gap-x-2 hover:bg-primary-accent rounded-sm px-3 py-2" :class="{'bg-primary-accent':$route.path === '/admin/dashboard'}">
                                <ion-icon name="home"></ion-icon>
                                Dashboard
                             </span>
                        </router-link>
                    </li>
                    <li class="w-full">
                        <router-link to="/admin/products">
                            <span class="flex items-center gap-x-2 px-3 py-2 rounded-sm duration-200 hover:bg-primary-accent" :class="{'bg-primary-accent':$route.path === '/admin/products'}">
                                <ion-icon name="cube"></ion-icon>
                                Products
                            </span>
                        </router-link>
                    </li>
                    <li class="w-full">
                        <router-link to="/admin/orders">
                            <span class="flex items-center gap-x-2 px-3 py-2 rounded-sm duration-200 hover:bg-primary-accent" :class="{'bg-primary-accent':$route.path === '/admin/orders'}">
                                <ion-icon name="cart"></ion-icon>
                                Orders
                            </span>
                        </router-link>
                    </li>
                    <li class="w-full">
                        <router-link to="/admin/customers">
                            <span class="flex items-center gap-x-2 px-3 py-2 rounded-sm duration-200 hover:bg-primary-accent" :class="{'bg-primary-accent':$route.path === '/admin/customers'}">
                                <ion-icon name="people"></ion-icon>
                                Customers
                            </span>
                        </router-link>
                    </li>
                </ul>
            </nav>
        </aside>

        <div class="grow h-screen overflow-y-scroll">
            <RouterView />
        </div>
    </div>
</template>