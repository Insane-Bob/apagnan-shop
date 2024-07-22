<script setup lang="ts">

import {DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@components/ui/dialog";
import Button from "@components/ui/button/Button.vue";
import Select from "@components/ui/select/Select.vue";
import type {Order} from "@/types";
import SelectItem from "@components/ui/select/SelectItem.vue";
import SelectTrigger from "@components/ui/select/SelectTrigger.vue";
import SelectContent from "@components/ui/select/SelectContent.vue";
import SelectValue from "@components/ui/select/SelectValue.vue";
import SelectGroup from "@components/ui/select/SelectGroup.vue";
import SelectLabel from "@components/ui/select/SelectLabel.vue";
import {computed, ref} from "vue";
import {useForm} from "@/composables/useForm";
import {useToast} from "@components/ui/toast";


const {toast} = useToast()

const props = defineProps<{
  order: Order
}>()

const statusSelected = ref<string>(props.order.status)
const payload = computed(()=>({
  status: statusSelected.value
}))

const emits = defineEmits(["close"])

const {submit} = useForm(`/orders/${props.order.id}`, payload, "patch")
function handleSubmit(){
  submit(()=>{
    emits('close')
  },(e)=>{
    if(e.response && e.response.data.message && e.response.status == 403){
      toast({
        title: e.response.data.message,
        variant: "destructive"
      })
    }else toast({
      title: "Erreur lors de la mise a jour du statut",
      variant: "destructive"
    })
  })
}
</script>

<template>
  <DialogContent>
    <form @submit.prevent.stop="handleSubmit">
      <DialogHeader>
        <DialogTitle>Mettre a jour le statut</DialogTitle>
      </DialogHeader>

      <div class="py-5">
        <Select v-model="statusSelected">
          <SelectTrigger class="w-full" >
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Traitement</SelectLabel>
              <SelectItem value="processing">
                En cours de traitement
              </SelectItem>
              <SelectItem value="shipped">
                Expédiée
              </SelectItem>

            </SelectGroup>
            <SelectGroup>
              <SelectLabel>
                <ion-icon name="alert-circle-outline"></ion-icon>
                Statuts iréversibles
              </SelectLabel>
              <SelectItem value="delivered">
                Livrée
              </SelectItem>
              <SelectItem value="cancelled">
                Annulée
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <DialogClose class="flex gap-5">
          <Button type="submit">Mettre a jour</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  </DialogContent>
</template>

<style scoped>

</style>