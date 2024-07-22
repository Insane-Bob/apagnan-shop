<script setup lang="ts">
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ref, defineProps, defineEmits } from 'vue'
import { ApiClient } from '@/lib/apiClient'

const apiClient = new ApiClient()

const emit = defineEmits(['stockUpdated'])
const props = defineProps<{
    productId: number
}>()

const quantity = ref(0)

const addStock = async () => {
    const response = await apiClient.post('stocks/add-stock', {
        quantity: quantity.value,
        productId: props.productId,
    })

    if (response.status === 200) {
        emit('stockUpdated')
    }
}

const removeStock = async () => {
    const response = await apiClient.post('stocks/remove-stock', {
        quantity: quantity.value,
        productId: props.productId,
    })
    if (response.status === 200) {
        emit('stockUpdated')
    }
}
</script>

<template>
    <DialogContent>
        <form>
            <DialogHeader>
                <DialogTitle>Gestion du stock</DialogTitle>
            </DialogHeader>

            <FormGrid>
                <FormInput
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Quantité</template>
                    <template #input="inputProps">
                        <input
                            type="number"
                            v-model="quantity"
                            v-bind="inputProps"
                            min="0"
                        />
                    </template>
                </FormInput>
            </FormGrid>

            <DialogFooter class="mt-4">
                <DialogClose class="flex gap-5">
                    <Button type="button" @click="addStock">Ajouter</Button>
                    <Button type="button" @click="removeStock">Retirer</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    </DialogContent>
</template>
