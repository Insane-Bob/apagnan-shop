<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue'
import Button from '@/components/ui/button/Button.vue'
import { useFilters } from '@/composables/useFilters'
import { useTable } from '@/composables/useTable'
import type { Promo, TableActions, TableColumns } from '@/types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { reactive } from 'vue';
import PromoForm from '@/components/views/admin/promos/PromoForm.vue'
import { ApiClient } from '@/lib/apiClient';


const apiClient = new ApiClient()

const form = reactive<{ promo: Promo | null }>({
    promo: null,
})

const { filters, query, resetFilters } = useFilters({
    published: [],
    search: '',
})

const { fetch, rows, pagination, sorting } = useTable('/promos', query)


const columns: TableColumns[] = [
    {
        label: 'Code',
        key: 'code',
    },
    {
        label: 'Réduction',
        key: 'value',
    },
    {
        label: 'Type',
        key: 'type',
        toDisplay: (value: string) => {
            if (value === 'percent') return 'Pourcentage'
            if (value === 'amount') return 'Montant'
            return value
        },
    },
    {
        label: 'Mise en avant',
        key: 'promoted',
        toDisplay: (value: boolean) => (value ? 'Oui' : 'Non'),
    },
    {
        label: 'Disponible',
        key: 'available',
        toDisplay: (value: boolean) => (value ? 'Oui' : 'Non'),
    },
]

const actions: TableActions[] = [
    {
        label: 'Ne plus mettre en avant',
        icon: 'star-outline',
        class: 'text-yellow-500',
        condition: (row: any) => row.promoted,
        action: (row: any) => {
            updatePromo({id: row.id, promoted: false})
        },
    },
    {
        label: 'Mettre en avant',
        icon: 'star',
        class: 'text-yellow-500',
        condition: (row: any) => !row.promoted,
        action: (row: any) => {
            updatePromo({id: row.id, promoted: true})
    },
    },
    {
        label: 'Désactiver',
        icon: 'eye-off-outline',
        class: 'text-orange-400',
        condition: (row: any) => row.available,
        action: (row: Promo) => {
            updatePromo({id: row.id, available: false})
        },
    },
    {
        label: 'Activer',
        icon: 'eye-outline',
        class: 'text-green-500',
        condition: (row: any) => !row.available,
        action: (row: any) => {
            updatePromo({id: row.id, available: true})
        },
    },
]

const updatePromo = async (row: any) => {
    await apiClient.patch('promos/' + row.id, 
        row
    )
    fetch()
}

const fetchPromo = () => {
    fetch()
}

</script>
<template>
   <Dialog>
        <div class="flex flex-col mx-6">
            <div class="flex justify-between items-center mb-3">
                <div class="flex gap-4 items-center">
                    <OutlinedInput
                        class="max-w-[200px]"
                        placeholder="Recherche"
                        v-model="filters.search"
                    >
                    </OutlinedInput>

                    <Filter label="Status" v-model="filters.published">
                        <FilterItem value="true" label="publié" />
                        <FilterItem value="false" label="non publié" />
                    </Filter>
                </div>
                <DialogTrigger>
                    <Button
                        @click="form.promo = null"
                        class="w-min whitespace-nowrap flex justify-center items-center gap-x-2"
                    >
                        <span>Créer une nouvelle promo</span>
                        <ion-icon
                            class="text-lg"
                            name="add-circle-outline"
                        ></ion-icon>
                    </Button>
                </DialogTrigger>
            </div>
            <DataTable
                :columns="columns"
                :rows="rows"
                :pagination="pagination"
                :sorting="sorting"
                :actions="actions"
            ></DataTable>
        </div>

        <DialogContent>
            <PromoForm :promo="form.promo" @reload-promo="fetch" />
        </DialogContent>
    </Dialog>
</template>