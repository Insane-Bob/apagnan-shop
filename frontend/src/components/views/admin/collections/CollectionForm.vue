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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast/use-toast'
import { useForm } from '@/composables/useForm'
import ImagePicker from '@components/Inputs/ImagePicker.vue'
import { Collection } from '@types'
import { computed, defineProps, ref } from 'vue'

const { toast } = useToast()
const emits = defineEmits(['close'])

const props = defineProps<{
    collection?: Collection
}>()

const name = ref(props.collection?.name || '')
const description = ref(props.collection?.description || '')
const published = ref(props.collection?.published || false)
const errors = ref(null)

const isModalOpen = ref(true)

const onSubmit = () => {
    if (props.collection) {
        updateCollection()
    } else {
        createCollection()
    }
}

const paylodUpdate = computed(() => ({
    name: name.value,
    description: description.value,
    published: published.value,
    imageId: image.value?.id ?? null,
}))
const { submit: submitUpdate } = useForm(
    '/collections/' + props.collection?.slug,
    paylodUpdate,
    'patch',
)
function updateCollection() {
    submitUpdate(
        () => {
            toast({
                title: 'Succés',
                description: 'La collection a été modifiée avec succès',
            })
            emits('close')
        },
        (e) => {
            if (
                e.response &&
                e.response.data.message &&
                e.response.status == 403
            ) {
                toast({
                    title: e.response.data.message,
                    variant: 'destructive',
                })
            } else if (e.response.status == 422) {
                errors.value = e.response.data.errors
            }
        },
    )
}

// Create a new collection
const payloadCreation = computed(() => ({
    name: name.value,
    description: description.value,
    published: published.value,
    imageId: image.value?.id ?? null,
}))
const { submit: submitCreation } = useForm(
    '/collections',
    payloadCreation,
    'post',
)
function createCollection() {
    submitCreation(
        () => {
            toast({
                title: 'Succés',
                description: 'La collection a été créée avec succès',
            })
            emits('close')
        },
        (e) => {
            if (
                e.response &&
                e.response.data.message &&
                e.response.status == 403
            ) {
                toast({
                    title: e.response.data.message,
                    variant: 'destructive',
                })
            } else if (e.response.status == 422) {
                errors.value = e.response.data.errors
            }
        },
    )
}

const image = ref(props.collection?.image || null)
const images = computed({
    get: () => [image] || [],
    set: (value) => {
        image.value = value[0]
    },
})
</script>

<template>
    <DialogContent>
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
                v-model="images"
                name="imageId"
                label="Image"
                :multiple="false"
                limit="1"
                :errors="errors"
            ></ImagePicker>

            <DialogFooter class="mt-4">
                <DialogClose>
                    <Button variant="destructive">Fermer</Button>
                </DialogClose>
                <Button type="submit">{{
                    props.collection ? 'Sauvegarder' : 'Créer'
                }}</Button>
            </DialogFooter>
        </form>
    </DialogContent>
</template>
