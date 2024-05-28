<script lang="ts" setup>
import SimpleTable from '@components/tables/SimpleTable.vue';
import Button from '@components/ui/button/Button.vue';
import { reactive } from 'vue';

const columns = reactive([
    {
        label: 'ID',
        key: 'id',
        sorting: false,
        position: 'left'
    },
    {
        label: 'Date',
        key: 'date',
        type: 'date',
        sorting: true,
        position: 'left',
        toDisplay: (value: any) => 
        {
            const option = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(value).toLocaleDateString('fr-FR', option)
        }
    },
    {
        label: 'Total',
        key: 'total',
        sorting: true,
        position: 'right',
        toDisplay: (value: any) => `${value} €`
    },
    {
        label: 'Status',
        key: 'status',
        sorting: true,
        position: 'right'
    }
]);

const rows: any = [
    {
        id: 1,
        date: new Date('2021-10-10'),
        total: 100,
        status: 'En cours'
    },
    {
        id: 2,
        date: new Date('2021-10-11'),
        total: 200,
        status: 'En cours'
    },
    {
        id: 3,
        date: new Date('2021-10-12'),
        total: 300,
        status: 'En cours'
    },
    {
        id: 4,
        date: new Date('2021-10-13'),
        total: 400,
        status: 'En cours'
    },
    {
        id: 5,
        date: new Date('2021-10-14'),
        total: 500,
        status: 'En cours'
    },
    {
        id: 6,
        date: new Date('2021-10-15'),
        total: 600,
        status: 'En cours'
    },
    {
        id: 7,
        date: new Date('2021-10-16'),
        total: 700,
        status: 'En cours'
    },
    {
        id: 8,
        date: new Date('2021-10-17'),
        total: 800,
        status: 'En cours'
    },
    {
        id: 9,
        date: new Date('2021-10-18'),
        total: 900,
        status: 'En cours'
    },
    {
        id: 10,
        date: new Date('2021-10-19'),
        total: 1000,
        status: 'En cours'
    },
    {
        id: 11,
        date: new Date('2021-10-20'),
        total: 1100,
        status: 'En cours'
    }

]

const page = reactive(
    {
        current: 1,
        perPage: 5,
        total: rows.length
    }
)

</script>

<template>

    <div class="mx-12">
        <div v-if="rows.length === 0">
            <h1 class="text-3xl tracking-wider uppercase">Vos commandes apparaîtront ici</h1>

            <h2  class="text-lg tracking-wide font-extralight">Après avoir passé une commande, vous pourrez suivre son parcours à chaque étape.</h2>

            <Button class="mt-4 uppercase font-light" variant="secondary" >
                Continuer mes achats
            </Button>

            

        </div>

        <div v-else class="space-y-6">
            <h1 class="text-3xl tracking-wider uppercase">Mes Commandes</h1>
            <SimpleTable v-if="rows.length !== 0"
                v-bind:columns="columns"
                v-bind:rows="rows"
                v-bind:page="page"

                @emit-next-page="() => page.current++"
                @emit-previous-page="() => page.current--"
            ></SimpleTable>
        </div>

        <hr class="my-8" />

            <div class="flex flex-col w-full items-center justify-center gap-y-4">
                <span class="text-lg tracking-wider uppercase">Besoin d'aide ?</span>
                <div class="w-min group">
                    <span class="cursor-pointer whitespace-nowrap text-primary">Contacter un conseiller</span>
                    <hr class="w-0 group-hover:w-full border-t-primary border-t-2 duration-200">
                </div>
            </div>
    </div>
</template>