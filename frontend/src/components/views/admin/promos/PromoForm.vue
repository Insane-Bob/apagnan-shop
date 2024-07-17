<script setup lang="ts">
import {
    DateFormatter,
    CalendarDate,
    type DateValue,
    getLocalTimeZone
} from '@internationalized/date'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-vue-next'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import {
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { defineProps, reactive, ref, watch } from 'vue'
import { Promo } from '@types'
import { apiClient } from '@/lib/apiClient'

const props = defineProps<{
  promo?: Promo,
}>()

const emit = defineEmits(['reloadPromo'])

const df = new DateFormatter('fr-FR', {
  dateStyle: 'long',
})


const code = ref(props.promo?.code || '')
const value = ref(props.promo?.value || '')
const type = ref(props.promo?.type || '')
const promoted = ref(props.promo?.promoted || false)
const available = ref(props.promo?.available || false)

const endAt = props.promo && props.promo.endDate?{
    day: new Date(props.promo.endDate).getDate()-1 || null,
    month: new Date(props.promo.endDate).getMonth()+1 || null,
    year: new Date(props.promo.endDate).getFullYear() || null,
}: null

const endDate = endAt && endAt.day && endAt.month && endAt.year
    ?ref<DateValue>(new CalendarDate(endAt?.year, endAt?.month, endAt?.day))
    :ref<DateValue>() 


console.log(endDate.value)

const onSubmit = () => {
    if (props.promo) {
        updatePromo()
    } else {
        createPromo()
    }
}

const createPromo = async () => {

    let body: Promo  = {
        code: code.value.toUpperCase(),
        value: value.value,
        type: type.value,
        promoted: promoted.value,
        available: available.value,
    }

    if(endDate.value && endDate.value.day && endDate.value.month && endDate.value.year) {
        const finalEndDate: Date = new Date(endDate.value.year, endDate.value.month-1, endDate.value.day+1)
        body = {
            ...body,
            endDate: finalEndDate
        }
    }

    const response = await apiClient.post('promos/', body)

    if (response.status === 201) {
        const data = await response.data
        emit('reloadPromo', data.promo)
    }
}

const updatePromo = async () => {
    let body: Promo  = {
        code: code.value.toUpperCase(),
        value: (typeof value.value == 'string') ? parseInt(value.value) : value.value,
        type: type.value,
        promoted: promoted.value,
        available: available.value,
    }

    if(endDate.value && endDate.value.day && endDate.value.month && endDate.value.year) {
        const finalEndDate: Date = new Date(endDate.value.year, endDate.value.month-1, endDate.value.day+1)
        body = {
            ...body,
            endDate: finalEndDate
        }
    }

    const response = await apiClient.patch('promos/' + props.promo?.id, body)

    if (response.status === 200) {
        const data = await response.data
        emit('reloadPromo', data.promo)
    }
}


</script>

<template>
    <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>{{ props.promo? 'Modifier la promotion': 'Créer une promotion'}}</DialogTitle>
        </DialogHeader>

        <FormGrid>

            <FormInput class="col-start-1 col-span-full" required>
                <template #label>Code</template>
                <template #input="inputProps">
                    <input type="text" v-model="code" v-bind="inputProps" />
                </template>
            </FormInput>

            <FormInput class="col-start-1 col-span-6" required>
                <template #label>Valeur</template>
                <template #input="inputProps">
                    <input type="number" v-model="value" v-bind="inputProps" />
                </template>
            </FormInput>

            <Select v-model="type">
                <SelectTrigger class="col-span-6 self-end h-11">
                <SelectValue placeholder="Selectionner un type" />
                </SelectTrigger>
                <SelectContent>
                <SelectGroup>
                    <SelectItem value="percent">
                    Pourcentage
                    </SelectItem>
                    <SelectItem value="amount">
                    Fixe
                    </SelectItem>
                </SelectGroup>
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger as-child>
                <Button
                    variant="outline"
                    :class="cn(
                    'w-[280px] justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground',
                    )"
                >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ endDate ? df.format(endDate.toDate(getLocalTimeZone())) : "Choisir une date de fin" }}
                </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                <Calendar v-model="endDate" initial-focus />
                </PopoverContent>
            </Popover>


            <div class="row-span-1 col-start-1 col-span-full flex items-center gap-x-4">
                <Label
                @click="available = !available"
                for="available"
                class=" h-4 block text-xs text-zinc-800 font-medium first-letter:uppercase whitespace-nowrap">
                    Disponible
                </Label>
                <Switch name="available" type="text" :checked="available" @click="available = !available" class=""/>
            </div>

            <div class="row-span-1 col-start-1 col-span-full flex items-center gap-x-4">
                <Label
                @click="promoted = !promoted"
                for="promoted"
                class=" h-4 block text-xs text-zinc-800 font-medium first-letter:uppercase whitespace-nowrap">
                    Mise en avant
                </Label>
                <Switch name="promoted" type="text" :checked="promoted" @click="promoted = !promoted" class=""/>
            </div>

        </FormGrid>

        <DialogFooter>
            <DialogClose>
                <Button variant="destructive" class="border-slate-300">Fermer</Button>
            </DialogClose>
            <DialogClose>
                <Button>{{ props.promo?'Modifier': 'Créer' }}</Button>
            </DialogClose>
        </DialogFooter>
    </form>
</template>