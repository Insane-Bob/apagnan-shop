<script setup lang="ts">
import regions from "/src/assets/json/regions.json" with { type: "json" };
import FormGrid from '@/components/Forms/FormGrid.vue';
import FormInput from '@/components/Inputs/FormInput.vue';
import FormError from "@/components/Forms/FormError.vue";
import Button from '@/components/ui/button/Button.vue';
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectTrigger,
SelectValue,
SelectLabel,
} from '@/components/ui/select';
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const user = useUserStore()

const country = defineModel('country', { type: String, required: true })
const region = defineModel('region', { type: String, required: true })
const city = defineModel('city', { type: String, required: true })
const postalCode = defineModel('postalCode', { type: String, required: true })
const street = defineModel('street', { type: String, required: true })
const addressOption = defineModel('addressOption', { type: String, required: true })
const customAddress = defineModel('customAddress', { type: Boolean, required: true })


defineProps<{ errors: { city: string, postalCode: string, street: string } }>()


const countriesList = regions.map((country: {countryName: string}) => country.countryName)
const regionsList = computed(() => {
    if(!country.value) return []
    return regions.find((r: {countryName: string}) => r.countryName === country.value).regions.map((r: {name: string}) => r.name)
})

</script>
<template>
    <Select
        v-model="addressOption"
        @update:modelValue="$emit('updateSelect', $event)"
    >
        <SelectTrigger>
            <SelectValue
                placeholder="Choisir une adresse"
            />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="custom"
                >-- Définir une adresse --</SelectItem
            >
            <SelectGroup
                v-if="user.getAddresses.length > 0"
                label="Adresses"
            >
                <SelectLabel
                    >Adresse Sauvegardée</SelectLabel
                >
                <SelectItem
                    v-for="(
                        address, index
                    ) in user.getAddresses"
                    :key="index"
                    :value="address.id.toString()"
                    >{{
                        address.street +
                        ', ' +
                        address.city +
                        ' ' +
                        address.postalCode +
                        ', ' +
                        address.country
                    }}</SelectItem
                >
            </SelectGroup>
        </SelectContent>
    </Select>
    <form v-if="customAddress">
        <FormGrid>
            <Select v-model="country">
                
                <SelectTrigger class="col-span-12 md:col-span-6">
                <SelectValue placeholder="Choisir un pays" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup label="Country">
                        <SelectItem v-for="(c, index) in countriesList" :key="index" :value="c">{{ c }}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select v-model="region">
                <SelectTrigger class="col-span-12 md:col-span-6">
                <SelectValue placeholder="Choisir une région" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup label="Region">
                        <SelectItem v-for="(r, index) in regionsList" :key="index" :value="r">{{ r }}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <div class="col-span-8">
                <FormInput >
                    <template #label>Ville</template>
                    <template #input="inputProps">
                        <input type="text" v-model="city" v-bind="inputProps" />
                    </template>
                </FormInput>
                <FormError v-if="errors.city" class="text-red-500 text-sm">{{ errors.city }}</FormError>
            </div>

            <div class="col-span-4">
                <FormInput >
                    <template #label>Code Postal</template>
                    <template #input="inputProps">
                        <input type="text" v-model="postalCode" v-bind="inputProps" />
                    </template>
                </FormInput>
                <FormError v-if="errors.postalCode" class="text-red-500 text-sm">{{ errors.postalCode }}</FormError>
            </div>

            <div class="col-span-full">
                <FormInput >
                    <template #label>Rue</template>
                    <template #input="inputProps">
                        <input type="text" v-model="street" v-bind="inputProps" placeholder="N° Rue, Boulevard, Avenue..." />
                    </template>
                    
                </FormInput>
                <FormError class="text-red-500 text-sm">{{ errors.street }}</FormError>
            </div>
        </FormGrid>
    </form>
</template>