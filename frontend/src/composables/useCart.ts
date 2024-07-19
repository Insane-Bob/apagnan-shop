import { useUserStore } from '@/stores/user'
import { useToast } from '@components/ui/toast'
import { ApiClient } from '@/lib/apiClient'
import { ref } from 'vue'
import type { Product } from '@/types'

export function useCart(product: ref<Product | null>): {
    quantitySelected: Ref<number>
    addToCart: () => void
} {
    const apiClient = new ApiClient()
    const quantitySelected = ref(1)
    const user = useUserStore()
    const { toast } = useToast()
    async function addToCart() {
        if (user.isAuthenticated && product.value) {
            if (quantitySelected.value > product.value.stock) {
                toast({
                    title: "Il n'y a pas assez de stock",
                    variant: 'destructive',
                })
                return
            }
            try {
                const reponse = await apiClient.put(
                    'users/' + user.getId + '/basket/' + product.value.id,
                    { quantity: quantitySelected.value },
                )
                user.addItem(reponse.data.items)
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
