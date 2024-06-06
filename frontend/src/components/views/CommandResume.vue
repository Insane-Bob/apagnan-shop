<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CardDescription from '../ui/card/CardDescription.vue';

const stapes = [
    {
        status: 'En attente',
        date: '23/01/2023 14:05',
        description: 'Votre nain est en cours de préparation'
    },
    {
        status: 'Expedié',
        date: '23/01/2023 14:05',
        description: 'Votre nain est parti de chez nous pour vous rejoindre'
    },
    {
        status: 'En cours de livraison',
        date: '23/01/2023 14:05',
        description: 'Votre nain est en route'
    },
    {
        status: 'Livré',
        date: '23/01/2023 14:05',
        description: 'Votre nain est arrivé à destination'
    },
    {
        status: 'Annulé',
        date: '23/01/2023 14:05',
        description: 'Votre nain est reparti chez nous'
    }
]
</script>

<template>
    <div class="mt-24 w-screen px-4 sm:px-16 lg:px-24">
        <div class="pt-12 pb-10">
            <h1 class="text-xl sm:text-2xl lg:text-4xl tracking-wider">Suivi de la commande <b>n°100A_1DA0_1Q1B</b></h1>
        </div>

        <div class="flex flex-col-reverse lg:flex-row flex-nowrap h-full gap-x-4">
            <menu class="flex-1 flex flex-col gap-y-3">
                <Card v-for="(stape, index) in stapes" :key="index" class="border rounded-sm w-full border-primary-accent px-4 border-l-8 border-r-primary shadow">
                    <CardHeader class="flex flex-row gap-x-2 items-center px-2 border-dashed border-b border-primary">{{ stape.status }} le <b>{{ stape.date }}</b></CardHeader>
                    <CardDescription class="px-2 py-4 italic">{{ stape.description }}</CardDescription>
                </Card>

            </menu>

            <hr class="w-full border-t-2 border-dashed border-primary lg:hidden my-4">

            <div class="flex-1 rounded-sm pt-2 px-2">
                <div class="rounded-sm border border-primary-accent">
                    <iframe width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps tracker sport</a></iframe>
                </div>
                <div class="flex flex-col space-y-2">
                    <h2 class="mt-4 text-3xl tracking-wider">Les informations de votre commande</h2>
                    <div>
                        <h2 class="text-xl tracking-wider">Où votre nain doit aller:</h2>
                        <p class="text-slate-600 italic">1 Grafton Street, Dublin, Ireland</p>
                    </div>
                    <div>
                        <h2 class="text-xl tracking-wider">Date d'achat:</h2>
                        <p class="text-slate-600 italic">23/01/2023 14h34</p>
                    </div>
                    <div>
                        <h2 class="text-xl tracking-wider">Date de livraison prévue:</h2>
                        <p class="text-slate-600 italic">28/01/2023 12h-16h</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>