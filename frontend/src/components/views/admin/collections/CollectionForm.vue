<script setup lang="ts">
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {computed, defineProps, ref} from 'vue'

import { ApiClient } from '@/lib/apiClient'
import { Collection } from '@types'
import ImagePicker from "@components/Inputs/ImagePicker.vue";

const apiClient = new ApiClient()

const emit = defineEmits(['reloadCollection'])

const props = defineProps<{
  collection?: Collection,
}>()

const name = ref(props.collection?.name || '')
const description = ref(props.collection?.description || '')
const published = ref(props.collection?.published || false)

const onSubmit = () => {
  if (props.collection) {
    updateCollection()
  } else {
    createCollection()
  }
}

const image = ref(props.collection?.image || null)

const updateCollection = async () => {
    const response = await apiClient.patch('collections/' + props.collection.slug, 
        {
            ...props.collection,
            name: name.value,
            description: description.value,
            published: published.value,
            imageId: image.value?.id ?? null
        }
    )

    if (response.status === 200) {
        const data = await response.data
        emit('reloadCollection', data.collection)
    }
}

const createCollection = async () => {
    const response = await apiClient.post('collections/' ,{
            name: name.value,
            description: description.value,
            published: published.value,
            imageId: image.value?.id ?? null
        })

    if (response.status === 200) {
        const data = await response.data
        emit('reloadCollection', data.collection)
    }
}

const images = computed({
  get: () => [image] || [],
  set: (value) => {
    image.value = value[0]
  }
})

</script>

<template>
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>{{ props.collection? 'Modifier la collection': 'Créer une collection'}}</DialogTitle>
        </DialogHeader>

        <FormGrid>

        <FormInput class="row-span-1 col-start-1 col-span-full" required>
          <template #label>Nom</template>
          <template #input="inputProps">
            <input type="text" v-model="name" v-bind="inputProps" />
          </template>
        </FormInput>

        <FormInput class="row-span-1 col-start-1 col-span-full" required>
          <template #label>Description</template>
          <template #input="inputProps">
            <Textarea type="text" v-model="description" v-bind="inputProps" />
          </template>
        </FormInput>

        <div class="row-span-1 col-start-1 col-span-full flex items-center gap-x-4">
          <Label
          @click="published = !published"
          for="published"
          class=" h-4 block text-xs text-zinc-800 font-medium first-letter:uppercase whitespace-nowrap">
            Publié
          </Label>
          <Switch name="published" type="text" :checked="published" @click="published = !published" class=""/>
        </div>
        </FormGrid>
        <ImagePicker label="Image" :multiple="false" limit="1" v-model="images"></ImagePicker>
        <DialogFooter class="mt-4">
          <DialogClose>
            <Button variant="destructive">Fermer</Button>
          </DialogClose>
          <DialogClose>
            <Button>{{ props.collection? 'Sauvegarder': 'Créer'}}</Button>
          </DialogClose>
        </DialogFooter>
      </form>
</template>