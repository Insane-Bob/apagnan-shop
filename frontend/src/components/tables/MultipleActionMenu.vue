<script setup lang="ts">
import { MoreVertical } from 'lucide-vue-next'
import DropdownMenu from '@components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '@components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@components/ui/dropdown-menu/DropdownMenuItem.vue'
import { useUserNotificationsStore } from '@/stores/userNotificationsStore'
import { computed } from 'vue'
import Button from '@components/ui/button/Button.vue'

const props = defineProps<{
    multipleActions: {
        label: string
        icon: string
        action: (ids: number[]) => void
    }[]
    selected: number[]
}>()
</script>

<template>
    <DropdownMenu v-if="props.selected.length">
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="sm">
                <div class="flex gap-3 items-center">
                    <MoreVertical class="size-4" />
                    Actions groupées
                </div>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem
                v-for="action in props.multipleActions"
                :key="action.label"
                @click="() => action.action(props.selected)"
            >
                <ion-icon
                    class="mr-3"
                    v-if="action.icon"
                    :name="action.icon"
                ></ion-icon>
                {{ action.label }} ({{ props.selected.length }})
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
