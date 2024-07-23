<script setup lang="ts">
import FormError from '@/components/Forms/FormError.vue'
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import {
    DialogContent,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ApiClient } from '@/lib/apiClient'
import { Promo } from '@types'
import { computed, ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { useForm } from '@/composables/useForm'

const { toast } = useToast()
const apiClient = new ApiClient()

const emits = defineEmits(['close'])

const code = ref('')
const value = ref('')
const type = ref('')
const promoted = ref(false)
const available = ref(false)
const errors = ref<any[]>([])

const payload = computed(() => ({
    code: code.value,
    value: value.value,
    type: type.value,
    promoted: promoted.value,
    available: available.value,
}))

const { submit } = useForm(`/promos`, payload, 'post')

function handleSubmit() {
    submit(
        () => {
            toast({
                title: 'Succés',
                description: 'La code promo a été créée avec succès',
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
</script>

<template>
    <DialogContent>
        <form @submit.prevent.stop="handleSubmit">
            <DialogHeader>
                <DialogTitle>Créer une promotion</DialogTitle>
            </DialogHeader>

            <FormGrid>
                <FormInput
                    name="code"
                    :errors="errors"
                    class="col-start-1 col-span-full"
                    required
                >
                    <template #label>Nom du code</template>
                    <template #input="inputProps">
                        <input type="text" v-model="code" v-bind="inputProps" />
                    </template>
                </FormInput>

                <FormInput
                    name="value"
                    :errors="errors"
                    class="col-start-1 col-span-6"
                    required
                >
                    <template #label>Valeur</template>
                    <template #input="inputProps">
                        <input
                            type="number"
                            v-model="value"
                            v-bind="inputProps"
                        />
                    </template>
                </FormInput>

                <Select v-model="type">
                    <SelectTrigger class="col-span-6 self-end h-11">
                        <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="percent">Pourcentage</SelectItem>
                            <SelectItem value="amount">Fixe</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div
                    class="row-span-1 col-start-1 col-span-full flex items-center gap-x-4"
                >
                    <Label
                        @click="available = !available"
                        for="available"
                        class="h-4 block text-xs text-zinc-800 font-medium first-letter:uppercase whitespace-nowrap"
                    >
                        Disponible
                    </Label>
                    <Switch
                        name="available"
                        type="text"
                        :checked="available"
                        @click="available = !available"
                        class=""
                    />
                </div>

                <div
                    class="row-span-1 col-start-1 col-span-full flex items-center gap-x-4"
                >
                    <Label
                        @click="promoted = !promoted"
                        for="promoted"
                        class="h-4 block text-xs text-zinc-800 font-medium first-letter:uppercase whitespace-nowrap"
                    >
                        Mise en avant
                    </Label>
                    <Switch
                        name="promoted"
                        type="text"
                        :checked="promoted"
                        @click="promoted = !promoted"
                        class=""
                    />
                </div>
            </FormGrid>

            <DialogFooter>
                <DialogClose class="flex gap-2">
                    <Button
                        type="button"
                        variant="destructive"
                        class="border-slate-300"
                        >Fermer</Button
                    >
                    <Button type="submit">Créer</Button>
                </DialogClose>
            </DialogFooter>
        </form>
    </DialogContent>
</template>
