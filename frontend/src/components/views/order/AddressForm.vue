<script setup lang="ts">
import regions from "/src/assets/json/regions.json" with { type: "json" };
import FormGrid from '@/components/Forms/FormGrid.vue';
import FormInput from '@/components/Inputs/FormInput.vue';
import Button from '@/components/ui/button/Button.vue';
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectTrigger,
SelectValue
} from '@/components/ui/select';
import { computed } from "vue";

const country = defineModel('country', { type: String, required: true })
const region = defineModel('region', { type: String, required: true })
const city = defineModel('city', { type: String, required: true })
const postalCode = defineModel('postalCode', { type: String, required: true })
const street = defineModel('street', { type: String, required: true })


const countriesList = regions.map((country: {countryName: string}) => country.countryName)
const regionsList = computed(() => {
    if(!country.value) return []
    return regions.find((r: {countryName: string}) => r.countryName === country.value).regions.map((r: {name: string}) => r.name)
})

</script>
<template>
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

        <FormInput class="col-span-8">
            <template #label>Ville</template>
            <template #input="inputProps">
                <input type="text" v-model="city" v-bind="inputProps" />
            </template>
        </FormInput>

        <FormInput class="col-span-4">
            <template #label>Code Postal</template>
            <template #input="inputProps">
                <input type="text" v-model="postalCode" v-bind="inputProps" />
            </template>
        </FormInput>

        <FormInput class="col-span-full">
            <template #label>Rue</template>
            <template #input="inputProps">
                <input type="text" v-model="street" v-bind="inputProps" placeholder="N° Rue, Boulevard, Avenue..." />
            </template>
        </FormInput>
    </FormGrid>
</template>