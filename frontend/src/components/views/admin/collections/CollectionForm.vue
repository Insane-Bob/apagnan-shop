<script setup lang="ts">
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { computed, defineProps, ref } from 'vue'
import { ApiClient } from '@/lib/apiClient'
import { Collection } from '@types'
import ImagePicker from '@components/Inputs/ImagePicker.vue'
import FormError from '@/components/Forms/FormError.vue'
import { useToast } from '@/components/ui/toast/use-toast'

const apiClient = new ApiClient()

const emit = defineEmits(['reloadCollection'])

const props = defineProps<{
    collection?: Collection
}>()

const { toast } = useToast()

const name = ref(props.collection?.name || '')
const description = ref(props.collection?.description || '')
const published = ref(props.collection?.published || false)
const image = ref(props.collection?.image || null)
const errors = ref<any[]>([])

const isModalOpen = ref(true)

const onSubmit = () => {
    if (props.collection) {
        updateCollection()
    } else {
        createCollection()
    }
}

const closeModal = () => {
    isModalOpen.value = false
}

const updateCollection = async () => {
    try {
        const response = await apiClient.patch(
            'collections/' + props.collection.slug,
            {
                ...props.collection,
                name: name.value,
                description: description.value,
                published: published.value,
                imageId: image.value?.id ?? null,
            },
        )

        if (response.status === 200) {
            const data = await response.data
            emit('reloadCollection', data.collection)
            toast({
                title: 'Succès',
                description: 'La collection a été mise à jour',
            })
        }
    } catch (error) {
        errors.value = error.response.data.errors || []
    }
}

const createCollection = async () => {
    try {
        const response = await apiClient.post('collections/', {
            name: name.value,
            description: description.value,
            published: published.value,
            imageId: image.value?.id ?? null,
        })

        if (response.status === 200) {
            const data = await response.data
            emit('reloadCollection', data.collection)
            toast({
                title: 'Succès',
                description: 'La collection a été créée',
            })
        }
    } catch (error) {
        errors.value = error.response.data.errors || []
    }
}

const images = computed({
    get: () => [image] || [],
    set: (value) => {
        image.value = value[0]
    },
})
</script>

<template>
    <div v-if="isModalOpen">
        <form @submit.prevent="onSubmit">
            <DialogHeader>
                <DialogTitle>{{
                    props.collection
                        ? 'Modifier la collection'
                        : 'Créer une collection'
                }}</DialogTitle>
            </DialogHeader>

            <FormGrid>
                <FormInput
                    name="name"
                    :errors="errors"
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Nom</template>
                    <template #input="inputProps">
                        <input type="text" v-model="name" v-bind="inputProps" />
                    </template>
                    <FormError
                        v-if="errors.some((error) => error.path === 'name')"
                    >
                        {{
                            errors.find((error) => error.path === 'name')
                                .message
                        }}
                    </FormError>
                </FormInput>

                <FormInput
                    name="description"
                    :errors="errors"
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Description</template>
                    <template #input="inputProps">
                        <Textarea
                            type="text"
                            v-model="description"
                            v-bind="inputProps"
                        />
                    </template>
                    <FormError
                        v-if="
                            errors.some((error) => error.path === 'description')
                        "
                    >
                        {{
                            errors.find((error) => error.path === 'description')
                                .message
                        }}
                    </FormError>
                </FormInput>

                <div
                    class="row-span-1 col-start-1 col-span-full flex items-center gap-x-4"
                >
                    <Label
                        @click="published = !published"
                        for="published"
                        class="h-4 block text-xs text-zinc-800 font-medium first-letter:uppercase whitespace-nowrap"
                    >
                        Publié
                    </Label>
                    <Switch
                        name="published"
                        type="text"
                        :checked="published"
                        @click="published = !published"
                        class=""
                    />
                </div>
            </FormGrid>

            <ImagePicker
                label="Image"
                :multiple="false"
                limit="1"
                v-model="images"
            >
            </ImagePicker>

            <DialogFooter class="mt-4">
                <DialogClose se>
                    <Button variant="destructive">Fermer</Button>
                </DialogClose>
                <Button type="submit">{{
                    props.collection ? 'Sauvegarder' : 'Créer'
                }}</Button>
            </DialogFooter>
        </form>
    </div>
</template>
