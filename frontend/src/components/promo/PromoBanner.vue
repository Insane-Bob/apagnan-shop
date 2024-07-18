<script setup lang="ts">
import  { apiClient} from '@/lib/apiClient'
import type { Promo } from '@/types';
import { onMounted, ref } from 'vue';
import { useToast } from '@components/ui/toast';


const { toast } = useToast()

const emits = defineEmits(['isPromo'])

const promos = ref<Promo[]>([])

const getPromotedPromo = async () => {
    const response = await apiClient.get('promos/promoted')
    if (response.status === 200) {
        const data = await response.data
        if (data.data.length > 0) {
            emits('isPromo', true)
            promos.value = data.data
            if (data.data.length > 1) {
                setInterval(() => {
                    switchPromoted()
                }, 8000)
            }
        }
        
        // emits('isPromo', data.promotion)
    }
}

const switchPromoted = () => {
    document.getElementById('promotedBanner')?.classList.add('opacity-0')
    setTimeout(() => {
        document.getElementById('promotedBanner')?.classList.remove('opacity-0')    
            const newPromo = promos.value.shift()
            if(newPromo) {
                promos.value.push(newPromo)
            }
    }, 500)
   
}


onMounted(() => {
    getPromotedPromo()
})

const copyToClipBoard = () => {
    navigator.clipboard.writeText(promos.value[0].code)
    toast({
        title: 'Code promo copié',
        description: promos.value[0].code
    })
}


</script>

<template>
    <div v-if="promos.length>0" class="h-8 min-w-[100vw] bg-gradient-to-r from-green-700 via-green-500 to-green-300 flex justify-center items-center overflow-x-hidden z-50">
        <span id="promotedBanner" class="text-white w-screen text-center duration-300">-{{ promos[0].value }}{{ promos[0].type === 'amount'? '€' : '%' }} sur votre commande avec le code: <span @click="copyToClipBoard()" class="cursor-pointer tracking-wider">{{ promos[0].code }}</span></span>
    </div>
</template>
