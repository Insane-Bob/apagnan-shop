import { ref, type Ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from '@components/ui/toast'
import { ApiClient } from '@/lib/apiClient'
import {computed, ref, type Ref} from 'vue'
import type { Product } from '@/types'

export function useCart(product: Ref<Product | null>, stock : Ref<number> | null): {
    quantitySelected: Ref<number>
    addToCart: () => void
} {
    const apiClient = new ApiClient()

    const stockComputed = computed(()=>{
        return stock?.value || product.value?.stock || 0

    })
    const quantitySelected = ref(1)
    const user = useUserStore()
    const { toast } = useToast()

    async function addToCart() {
        if (user.isAuthenticated && product.value) {
            const myQuantity = user.getItem(product.value.id) || { quantity: 0 }
            const availableStock = stockComputed.value + myQuantity?.quantity
            if (quantitySelected.value > availableStock) {
                toast({
                    title: "Il n'y a pas assez de stock",
                    variant: 'destructive',
                })
                return
            }
            try {
                const response = await apiClient.put(
                    `users/${user.getId}/basket/${product.value.id}`,
                    { quantity: quantitySelected.value },
                )
                user.addItem(response.data.items)
                toast({
                    title: 'Le produit a été ajouté à votre panier',
                })
            } catch (e) {
                toast({
                    title:
                        'Nous ne sommes pas parvenus à ajouter le produit ' +
                        product.value.name,
                    variant: 'destructive',
                })
                throw e
            }
        }
    }

    return { quantitySelected, addToCart }
}
