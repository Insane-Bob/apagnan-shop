<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormGrid from '@/components/Forms/FormGrid.vue'
import Button from '@/components/ui/button/Button.vue'
import { ref, defineProps } from 'vue'
import FormInput from '@/components/Inputs/FormInput.vue'

import { Collection } from '@types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const CollectionUrl = API_BASE_URL + '/collections/'

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

const updateCollection = async () => {
    const response = await fetch(CollectionUrl + props.collection.slug, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...props.collection,
            name: name.value,
            description: description.value,
            published: published.value
        })
    })

    if (response.status === 200) {
        const data = await response.json()
        emit('reloadCollection', data.collection)
    }
}

const createCollection = async () => {
    const response = await fetch(CollectionUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name.value,
            description: description.value,
            published: published.value
        })
    })

    if (response.status === 200) {
        const data = await response.json()
        emit('reloadCollection', data.collection)
    }
}

</script>

<template>
    <DialogContent>
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

        <DialogFooter class="mt-4">
          <DialogClose>
            <Button variant="destructive">Fermer</Button>
          </DialogClose>
          <DialogClose>
            <Button>{{ props.collection? 'Sauvegarder': 'Créer'}}</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
</template>