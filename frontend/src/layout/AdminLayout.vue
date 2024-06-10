<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { adminRoutes } from '@/routes/admin';
import { computed } from 'vue';

const routes = computed(() => {
return adminRoutes[0].children.map((route) => {
    return {
        path: adminRoutes[0].path + '/' + route.path,
        name: route.name,
        icon: route.meta.icon,
        label: route.meta.label,
    };
});
});
</script>

<template>
    <div class="flex">
        <aside class="w-48 flex flex-col bg-primary h-screen text-primary-foreground">
            <h1 class="uppercase tracking-widest text-center text-2xl pt-8">APAGNAIN</h1>
            <nav class="px-4 pt-8 w-full grow">
                <ul class="flex flex-col justify-center items-start gap-y-4 w-full">
                    <li v-for="(route, index) in routes" :key="index" class="w-full">
                        <router-link :to="route.path">
                            <span class="flex items-center gap-x-2 hover:bg-primary-accent rounded-sm px-3 py-2" :class="{'bg-primary-accent':$route.path === route.path}">
                                <ion-icon :name="route.icon"></ion-icon>
                                {{route.label}}
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

        <div class="grow h-screen overflow-y-scroll flex flex-col w-full">
            <div class="h-1/5 w-full flex items-center pl-12">
                <h1 class="text-4xl tracking-widest">{{ routes.find((route) => route.path === $route.path)?.label }}</h1>
            </div>
            <div class="grow">
                <RouterView />
            </div>
        </div>
    </div>
</template>