<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Collection } from '@types'

const props = defineProps<{
  collection?: Collection,
}>()

</script>

<template>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ props.collection? 'Modifier la collection': 'Créer une collection'}}</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        Save changes
      </DialogFooter>
    </DialogContent>
</template>