<script setup lang="ts">
import SpecificFormItem from '@/components/views/admin/specifics/SpecificForm.vue'
import DataTable from '@/components/tables/DataTable.vue'
import { useFilters } from '@/composables/useFilters'
import { useTable } from '@/composables/useTable'
import { Specific } from '@types'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { reactive, defineProps, ref } from 'vue'

const props = defineProps<{
    productId?: number
}>()

const { filters, query } = useFilters({
    productId: props.productId,
})

const { fetch, rows, pagination, sorting } = useTable('/specifics', query)

const SpecificForm = reactive<{ specific: Specific | null }>({
    specific: null,
})

const columns = [
    {
        label: 'Nom',
        key: 'name',
        sorting: true,
    },
    {
        label: 'Contenu',
        key: 'content',
        sorting: true,
    },
]

const actions = [
    {
        label: 'Modifier',
        icon: 'pencil-outline',
        class: 'text-blue-500',
        trigger: true,
        action: (specific: Specific) => {
            SpecificForm.specific = specific
        },
    },
    {
        label: 'Supprimer',
        icon: 'trash-outline',
        class: 'text-red-500',
        action: (specific: Specific) => {
            console.log('delete', specific)
        },
    },
]

const fetchSpecifics = async () => {
    await fetch()
}
</script>

<template>
    <div>
        <h3 class="text-lg font-semibold mb-4">Spécifiques</h3>
        <Dialog>
            <div class="flex flex-col">
                <DialogTrigger>
                    <Button
                        @click="SpecificForm.specific = null"
                        class="w-min whitespace-nowrap flex justify-center items-center gap-x-2 mb-4"
                    >
                        <span>Ajouter une specificité</span>
                        <ion-icon
                            class="text-lg"
                            name="add-circle-outline"
                        ></ion-icon>
                    </Button>
                </DialogTrigger>
                <DataTable
                    :columns="columns"
                    :rows="rows"
                    :pagination="pagination"
                    :actions="actions"
                    :sorting="sorting"
                ></DataTable>
            </div>

            <DialogContent>
                <SpecificFormItem
                    :specific="SpecificForm.specific"
                    :productId="props.productId"
                    @specificSaved="fetchSpecifics"
                ></SpecificFormItem>
            </DialogContent>
        </Dialog>
    </div>
</template>
