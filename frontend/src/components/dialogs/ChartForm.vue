<script setup lang="ts">

import FormGrid from '@/components/Forms/FormGrid.vue'
import FormHeader from '@/components/Forms/FormHeader.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import DialogClose from '../ui/dialog/DialogClose.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { reactive, ref } from 'vue'

const graphInput = ref('')
const dataInput = ref('')
const indexInput= ref('')

const emit =defineEmits(['submit'])

const submit =() => {

    if(graphInput.value === '' || dataInput.value === '' || indexInput.value === '') {
        console.error('empty field')
        return;
    }
    emit('submit', {chart: graphInput.value, data: dataInput.value, index: indexInput.value});

}

</script>

<template>
    <div class="max-h-[70vh] max-w-[60vw]">
        
        <form @click.prevent="submit" class="w-full">
            <FormHeader>
                <h1 class="text-2xl tracking-wider">Ajouter un graphique</h1>
            </FormHeader>
            <FormGrid class="w-full">
                <!-- EMAIL -->
                <div class="flex flex-col col-span-full gap-4">
                    <FormInput class="row-span-1 col-start-1 col-span-full" required>
                    <template #label>Graphique</template>
                    <template #input="inputProps">
                        <Select class="w-full" v-bind="inputProps" v-model="graphInput"  >
                            <SelectTrigger class="w-full">
                                <SelectValue  placeholder="Selectionner un graphique" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                <SelectItem value="line">
                                    Graphique à ligne
                                </SelectItem>
                                <SelectItem value="pie">
                                    Diagramme Circulaire
                                </SelectItem>
                                <SelectItem value="doughnut">
                                    Diagramme Donut
                                </SelectItem>
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                    </template>
                    </FormInput>

                    <FormInput class="row-span-1 col-start-1 col-span-full" required>
                    <template #label>Données</template>
                    <template #input="inputProps">
                        <Select class="w-full" v-bind="inputProps" v-model="dataInput">
                            <SelectTrigger class="w-full">
                                <SelectValue v-model="dataInput" placeholder="Selectionner un graphique" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                <SelectItem value="sells">
                                    Vente en €
                                </SelectItem>
                                <SelectItem value="pie">
                                    Diagramme Circulaire
                                </SelectItem>
                                <SelectItem value="donut">
                                    Diagramme Donut
                                </SelectItem>
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                    </template>
                    </FormInput>

                    <FormInput class="row-span-1 col-start-1 col-span-full" required>
                    <template #label>Index</template>
                    <template #input="inputProps">
                        <Select class="w-full" v-bind="inputProps" v-model="indexInput">
                            <SelectTrigger class="w-full">
                                <SelectValue v-model="indexInput" placeholder="Selectionner une abscysse" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Temps</SelectLabel>
                                <SelectItem value="day">
                                    Par jours
                                </SelectItem>
                                <SelectItem value="week">
                                    Par semaine
                                </SelectItem>
                                <SelectItem value="month">
                                    Par mois
                                </SelectItem>
                                <SelectItem value="year">
                                    Par ans
                                </SelectItem>

                                <SelectLabel>Unité</SelectLabel>
                                <SelectItem value="users">
                                    Par utilisateurs
                                </SelectItem>
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                    </template>
                    </FormInput>
                </div>

                    <!-- SUBMIT -->
                    

                    <div class="col-span-6  w-full flex justify-center items-center">
                        <DialogClose class="w-full">
                            <Button  class="w-full" variant="destructive" type="button">
                                Annuler
                            </Button>
                        </DialogClose>
                    </div>

                    <div class="col-span-6 w-full flex justify-center items-center">
                        <Button type="submit" class="w-full">
                            Ajouter le graphique
                        </Button>
                    </div>
            </FormGrid>
        </form>
    </div>
</template>