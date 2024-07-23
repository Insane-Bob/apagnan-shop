<script setup lang="ts">
import MyBreadcrumbComponent from '@/components/breadcrumb/MyBreadcrumbComponent.vue'
import { adminRoutes } from '@/routes/admin'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Search from '@components/Dashboard/Search.vue'
import UserNav from '@components/Dashboard/UserNav.vue'
import { translate } from '@utils/translateBreadcrumb.js'

const routes = computed(() => {
    return adminRoutes[0].children.map((route) => {
        return {
            path: adminRoutes[0].path + '/' + route.path,
            name: route.name,
            icon: route.meta.icon,
            label: route.meta.label,
        }
    })
})

const $route = useRoute()

const links = computed(() => {
    return $route.path
        .split('/')
        .slice(1)
        .map((path, index) => {
            return [
                translate[path] || path,
                $route.path
                    .split('/')
                    .slice(0, index + 2)
                    .join('/'),
            ]
        })
})
</script>

<template>
    <div class="flex bg-accent">
        <aside
            class="w-64 m-6 mr-0 flex flex-col rounded bg-gradient-to-b from-primary/70 to-primary text-white shadow-lg"
        >
            <RouterLink class="pt-8" to="/">
                <img src="/src/assets/logo_white.svg" alt="Apagnain Logo" />
            </RouterLink>
            <nav class="px-4 pt-8 w-full flex-grow">
                <ul class="flex flex-col gap-y-4">
                    <li
                        v-for="(route, index) in routes"
                        :key="index"
                        class="w-full"
                    >
                        <router-link :to="route.path">
                            <span
                                class="flex items-center gap-x-2 hover:bg-primary hover:text-white rounded-sm px-3 py-2 transition-colors duration-200"
                                :class="{
                                    'bg-primary text-white':
                                        $route.path === route.path,
                                }"
                            >
                                <ion-icon :name="route.icon"></ion-icon>
                                {{ route.label }}
                            </span>
                        </router-link>
                    </li>
                </ul>
            </nav>
        </aside>

        <div class="overflow-y-auto grow h-screen flex flex-col w-full">
            <div class="pt-6 pr-3">
                <div class="flex h-16 items-center px-4">
                    <TeamSwitcher />
                    <MainNav class="mx-6" />
                    <div class="ml-auto flex items-center space-x-4">
                        <Search />
                        <UserNav />
                    </div>
                </div>
            </div>
            <div class="h-1/5 w-full flex flex-col justify-center px-6 pb-6">
                <h1 class="text-4xl tracking-widest">
                    {{
                        routes.find((route) => route.path === $route.path)
                            ?.label
                    }}
                </h1>
                <div class="h-14 flex w-full">
                    <MyBreadcrumbComponent
                        :links="links"
                        class="bg-transparent"
                    />
                </div>
            </div>

            <div class="grow pb-12">
                <RouterView />
            </div>
        </div>
    </div>
</template>
