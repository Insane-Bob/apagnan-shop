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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { defineProps, ref, defineEmits } from 'vue'
import { ApiClient } from '@/lib/apiClient'
import { Specific } from '@types'

const apiClient = new ApiClient()

const props = defineProps<{
    specific?: Specific
    productId?: number
}>()

const emit = defineEmits(['specificSaved'])

const name = ref(props.specific?.name || '')
const content = ref(props.specific?.content || '')
const productId = ref(props.productId || 0)

const onSubmit = () => {
    if (props.specific) {
        updateSpecific()
    } else {
        createSpecific()
    }
}

const updateSpecific = async () => {
    const response = await apiClient.patch('specifics/' + props.specific.id, {
        ...props.specific,
        name: name.value,
        content: content.value,
    })

    if (response.status === 200) {
        emit('specificSaved')
    }
}

const createSpecific = async () => {
    const response = await apiClient.post('specifics/', {
        name: name.value,
        content: content.value,
        productId: productId.value,
    })

    if (response.status === 201) {
        emit('specificSaved')
    }
}
</script>

<template>
    <DialogContent>
        <form @submit.prevent="onSubmit">
            <DialogHeader>
                <DialogTitle>{{
                    props.specific
                        ? 'Modifier la spécificité'
                        : 'Créer une spécificité'
                }}</DialogTitle>
            </DialogHeader>

            <FormGrid>
                <FormInput
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Nom</template>
                    <template #input="inputProps">
                        <input type="text" v-model="name" v-bind="inputProps" />
                    </template>
                </FormInput>

                <FormInput
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Contenu</template>
                    <template #input="inputProps">
                        <Textarea
                            type="text"
                            v-model="content"
                            v-bind="inputProps"
                        />
                    </template>
                </FormInput>
            </FormGrid>

            <DialogFooter class="mt-4">
                <DialogClose>
                    <Button variant="destructive">Fermer</Button>
                </DialogClose>
                <DialogClose>
                    <Button>{{
                        props.specific ? 'Sauvegarder' : 'Créer'
                    }}</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    </DialogContent>
</template>
