<script setup lang="ts">
import { backofficeRoutesName } from '@/routes/backoffice'
import { useUserStore } from '@/stores/user'
import { AvatarFallback } from '@components/ui/avatar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CardHeader from "@components/ui/card/CardHeader.vue";
import Card from "@components/ui/card/Card.vue";
import Avatar from "@components/ui/avatar/Avatar.vue";
import CardTitle from "@components/ui/card/CardTitle.vue";
import CardDescription from "@components/ui/card/CardDescription.vue";
import Separator from "@components/ui/separator/Separator.vue";
import CardContent from "@components/ui/card/CardContent.vue";

import CardFooter from "@components/ui/card/CardFooter.vue";
import Button from "@components/ui/button/Button.vue";
import DeleteAccount from "@components/Modals/DeleteAccount.vue";


const userStore = useUserStore()
const route = useRoute()

const routes = computed(() => {
    return [
        {
            name: 'Mon compte',
            route: {
                name: backofficeRoutesName.PROFILE,
            },
            active: route.name === backofficeRoutesName.PROFILE,
        },
        {
            name: 'Mes informations',
            route: {
                name: backofficeRoutesName.INFORMATIONS,
            },
            active: route.name === backofficeRoutesName.INFORMATIONS,
        },
        {
            name: 'Mes Commandes',
            route: {
                name: backofficeRoutesName.COMMANDS,
            },
            active: route.name === backofficeRoutesName.COMMANDS,
        },
        {
            name: 'Mes Notifications',
            route: {
                name: backofficeRoutesName.NOTIFICATIONS,
            },
            active: route.name === backofficeRoutesName.NOTIFICATIONS,
        },
    ]
})
</script>

<template>
    <div class="p-12 bg-slate-50">
        <main class="grid grid-cols-3 gap-12 max-w-[1000px] mx-auto">
            <aside class="col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Mon compte</CardTitle>
                        <CardDescription class="flex items-center gap-4">
                            <Avatar class="h-8 w-8">
                                <AvatarFallback>
                                    {{ userStore.get.firstName[0]
                                    }}{{ userStore.get.lastName[0] }}
                                </AvatarFallback>
                            </Avatar>
                            <p>{{ userStore.identity }}</p>
                        </CardDescription>
                    </CardHeader>
                    <Separator></Separator>
                    <CardContent class="pt-6 flex flex-col gap-2">
                        <RouterLink :to="_route.route" v-for="(_route, index) in routes" :key="index">
                            <Button
                                variant="ghost"
                                class="flex gap-4"
                                :class="[
                                    _route.active
                                        ? 'text-primary'
                                        : 'text-gray-500',
                                ]"
                            >
                                {{ _route.name }}
                            </Button>
                        </RouterLink>
                    </CardContent>
                    <Separator></Separator>
                    <CardFooter class="pt-6 flex flex-col justify-start">
                        <RouterLink
                            to="/logout"
                            class="flex items-center text-sm transition-all"
                            variant="ghost"
                        >
                          <Button class="text-black" variant="ghost" >
                            <ion-icon
                                name="log-out-outline"
                                class="mr-2"
                            ></ion-icon>
                            Se déconnecter
                          </Button>
                        </RouterLink>
                            <DeleteAccount/>
                    </CardFooter>
                </Card>
            </aside>
            <div class="col-span-2">
                <slot></slot>
            </div>
        </main>
    </div>
</template>
