<script setup lang="ts">
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast/use-toast';
import { apiClient } from '@/lib/apiClient';
import type { Product } from '@/types';
import { useUserStore } from '@store/user';
import { ref } from 'vue';

const user = useUserStore()
const { toast } = useToast()


const props = defineProps<{
    quantity: number,
    product: Product
}>()

const oldQuantity = ref(props.quantity.toString())

const quantity = ref(props.quantity.toString())

console.log(props.product)

const removeFromCart = async () => {
    if (user.isAuthenticated && props.product) {
        const reponse = await  apiClient.delete('users/' + user.getId + '/basket/' + props.product.id)
        user.addItem(reponse.data.items)

        toast({
            title: 'Article supprimé du panier',
        })
        
    }
}

const onQuantityUpdated = async () => {
    if (user.isAuthenticated && props.product) {
        try{
            const response = await  apiClient.put('users/' + user.getId + '/basket/' + props.product.id, {quantity: quantity.value} )

            user.addItem(response.data.items)
            oldQuantity.value = quantity.value
            toast({
                title: 'Quantité mise à jour',
            })
        }catch(e){
            quantity.value = oldQuantity.value
            await  apiClient.put('users/' + user.getId + '/basket/' + props.product.id, {quantity: quantity.value} )
            toast({
                title: 'Erreur lors de la mise à jour de la quantité',
                description: 'Il n\'y a pas assez de stock pour cette quantité',
                variant: 'destructive'
            })
        }

        
    }
}
</script>
<template>
        <div v-if="quantity" class="flex items-center gap-x-4 my-4">
            <img v-if="product.images && product.images.length > 0"
                class="w-20 h-20"
                :src="'/src/' + product.images[0].path"
                :alt="product.name"
            />
            <div v-else class="relative group">
                <img 
                    class="w-20 h-20 relative"
                    src="/src/assets/images/noPhotoAvailable.webp"
                    alt="placeholder"
                />
                <div class="absolute invisible group-hover:visible bg-black/40 w-20 h-20 top-0 left-0 cursor-default flex items-center">
                    <p class="text-white text-center">pas de photo disponible</p>
                </div>
            </div>
            <div class="flex flex-col gap-y-2">
                <h3 class="text-lg font-semibold">{{ product.name }}</h3>
                <p class="text-sm">prix: {{ product.price }} €</p>
                <p class="text-sm">quantité: x{{ quantity }}</p>
            </div>
            <div class="flex justify-end grow">
                <div class="flex flex-col mr-2 justify-end gap-y-2">
                    <div class="flex items-center gap-x-2 max-w-72">
                        <Select v-model="quantity" @update:modelValue="onQuantityUpdated()" >
                            <SelectTrigger class="focus:ring-none ring-transparent focus:border-primary">
                            <SelectValue  placeholder="Quantité" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="(value,index) in (product.stock +  parseInt(quantity))" :value="value.toFixed()" :key="index">
                                    {{ value.toFixed() }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <button @click="removeFromCart" class="text-red-500 flex items-center gap-x-1">
                        <ion-icon name="trash-outline"></ion-icon>
                        <span>Supprimer</span>
                    </button>
                </div>
            </div>
        </div>
</template>