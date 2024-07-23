<script setup lang="ts">
import { MoreVertical } from 'lucide-vue-next'
import DropdownMenu from '@components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '@components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@components/ui/dropdown-menu/DropdownMenuItem.vue'
import { useUserNotificationsStore } from '@/stores/userNotificationsStore'
import { computed } from 'vue'
import Button from '@components/ui/button/Button.vue'

const userNotification = useUserNotificationsStore()

const props = defineProps<{
    modelType: string
    id: number
}>()

const menuItems = computed(() => {
    return userNotification.getDropdownMenuItems(props.modelType, props.id)
})
</script>

<template>
    <DropdownMenu v-if="userNotification.preferences">
        <DropdownMenuTrigger as-child>
            <Button variant="ghost">
                <slot>
                    <MoreVertical class="size-4" />
                    <span class="sr-only">More</span>
                </slot>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem
                v-for="item in menuItems"
                :key="item.id"
                @click="item.action"
            >
                <ion-icon
                    class="mr-3"
                    v-if="item.icon"
                    :name="item.icon"
                ></ion-icon>
                {{ item.label }}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>