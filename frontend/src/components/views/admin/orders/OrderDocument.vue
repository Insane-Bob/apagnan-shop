<script setup lang="ts">
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { OrderFormat } from '@/utils/orderFormat'
import DocumentsList from '../../order/DocumentsList.vue';

const props = defineProps<{
    order: Order
}>()

const formattedOrderNumber = OrderFormat.formatOrderNumber(props.order.id)
</script>

<template>
    <DialogContent>
        <DialogHeader>
            <DialogTitle
                >Documents de la commande
                {{ formattedOrderNumber }}
            </DialogTitle>
        </DialogHeader>
        <div class="py-5">
            <DocumentsList :order="props.order" />
        </div>
    </DialogContent>
</template>
