<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
    <div class="flex">
        <aside class="w-48 flex flex-col bg-primary h-screen text-primary-foreground">
            <h1 class="uppercase tracking-widest text-center text-2xl pt-8">APAGNAIN</h1>
            <nav class="px-4 pt-8 w-full grow">
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
                        <router-link to="/admin/collections">
                            <span class="flex items-center gap-x-2 px-3 py-2 rounded-sm duration-200 hover:bg-primary-accent" :class="{'bg-primary-accent':$route.path === '/admin/collections'}">
                                <ion-icon name="albums"></ion-icon>
                                Collections
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

                    <li class="w-full">
                        <router-link to="/admin/users">
                            <span class="flex items-center gap-x-2 px-3 py-2 rounded-sm duration-200 hover:bg-primary-accent" :class="{'bg-primary-accent':$route.path === '/admin/users'}">
                                <ion-icon name="people-circle"></ion-icon>
                                Users
                            </span>
                        </router-link>
                    </li>
                </ul>
            </nav>

            <div class="flex flex-col gap-y-3 px-3 pb-8">
                <RouterLink to="/admin/settings">
                    <Button variant="secondary" class="w-full">Paramètre</Button>
                </RouterLink>

                <RouterLink to="/home">
                    <Button variant="secondary" class="w-full flex items-center gap-x-2">

                        <ion-icon name="log-in"></ion-icon>
                        Revenir au site
                    </Button>
                </RouterLink>

                <RouterLink to="/logout">
                    <Button class="w-full">Deconnexion</Button>
                </RouterLink>
            </div>
        </aside>

        <div class="grow h-screen overflow-y-scroll">
            <RouterView />
        </div>
    </div>
</template>