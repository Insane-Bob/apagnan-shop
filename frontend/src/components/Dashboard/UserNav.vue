<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Button } from '@components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                <Avatar class="h-8 w-8" color="primary">
                    <AvatarFallback
                        >{{ userStore.get.firstName[0]
                        }}{{ userStore.get.lastName[0] }}</AvatarFallback
                    >
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end">
            <DropdownMenuLabel class="font-normal flex">
                <div class="flex flex-col space-y-1">
                    <p class="text-sm font-medium leading-none">
                        {{ userStore.identity }}
                    </p>
                    <p class="text-xs leading-none text-muted-foreground">
                        {{ userStore.get.email }}
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <RouterLink to="/profile">
                    <DropdownMenuItem class="flex items-center gap-2">
                        <ion-icon name="people"></ion-icon> Profil
                    </DropdownMenuItem>
                </RouterLink>
                <RouterLink to="/home">
                    <DropdownMenuItem class="flex items-center gap-2">
                        <ion-icon name="log-in"></ion-icon> Retour au site
                    </DropdownMenuItem>
                </RouterLink>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <RouterLink to="/logout">
                <DropdownMenuItem class="flex items-center gap-2">
                    <ion-icon name="log-out"></ion-icon> Déconnexion
                </DropdownMenuItem>
            </RouterLink>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
