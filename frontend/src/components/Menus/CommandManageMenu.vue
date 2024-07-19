<script setup lang="ts">

import type {Order} from "@/types";
import {computed, ComputedRef, ref} from "vue";
import DropdownMenuTrigger from "@components/ui/dropdown-menu/DropdownMenuTrigger.vue";
import Button from "@components/ui/button/Button.vue";
import DropdownMenuContent from "@components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "@components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenu from "@components/ui/dropdown-menu/DropdownMenu.vue";
import {MoreVertical} from "lucide-vue-next";
import CancelOrderForm from "@components/Forms/CancelOrderForm.vue";
import Dialog from "@components/ui/dialog/Dialog.vue";
import DialogContent from "@components/ui/dialog/DialogContent.vue";
import {apiClient} from "@/lib/apiClient";
import {useCart} from "@/composables/useCart";
import {orderRoutesName} from "@/routes/order";
import {useRouter} from "vue-router";

const props = defineProps<{
  order: Order
}>()
const order : ComputedRef<Order> = computed(() => props.order)

const router = useRouter()
const emits = defineEmits(['update'])

const dialogCancel = ref(false)
const dialogRefund = ref(false)


/**
 * Methods
 */
function hasStatus(status: string) {
  return order.value?.statusHistory?.some((s) => s.status === status)
}

async function reorder() {
  const { data } = await apiClient.get(`/orders/${order.value?.id}/products`)
  const products = data.data
  for (let product of products) {
    const cart = useCart(ref(product.product))
    cart.quantitySelected.value = product.quantity
    await cart.addToCart()
  }
  router.push({ name: orderRoutesName.SUMMARY })
}

/**
 * Computed
 */

const canCancel = computed(()=>{
  return !hasStatus('shipped') && !hasStatus('delivered') && !hasStatus('cancelled')
})

const canRefund = computed(()=>{
  return hasStatus('delivered') && !hasStatus('refunded') && !hasStatus('cancelled')
})

const hasRefundWaiting = computed(()=>
    order.value.RefundRequestOrders.filter(
        (r) => !r.approved,
    ).length === 0)

</script>

<template>
  <DropdownMenu :modal="true">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost">
        <slot>
          <MoreVertical class="size-4" />
          <span class="sr-only">More</span>
        </slot>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem data-name="cancel">
        <Button variant="ghost" :disabled="!canCancel" @click="dialogCancel = true" size="sm">
          Annuler la commande
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem data-name="refund">
        <div>
          <Button variant="ghost" :disabled="!canRefund || hasRefundWaiting" @click="dialogRefund = true" size="sm">
            Demander un remboursement
          </Button>
          <div class="pl-3">
            <p v-if="hasRefundWaiting" class="italic text-slate-500">Une demande de remboursement est en attente</p>
            <p v-if="hasStatus('cancelled')" class="italic text-slate-500">Votre command est annulé</p>
          </div>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem data-name="reorder">
        <Button  variant="ghost"
                 class="text-primary"
                 @click="reorder()" size="sm"
        >
          Commander à nouveau
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>


  <Dialog v-model:open="dialogCancel">
    <DialogContent>
      <CancelOrderForm
          @close="() => {
                    emits('update')
                    dialogCancel = false
                }"
          :order="order"
      ></CancelOrderForm>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="dialogRefund">
    <DialogContent>
      <RefundRequestForm
          @close="() => {
                    emits('update')
                    dialogRefund = false
                }"
          :order="order"
      ></RefundRequestForm>
    </DialogContent>
  </Dialog>

</template>

<style scoped>

</style>