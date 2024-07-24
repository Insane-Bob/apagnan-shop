<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@components/ui/card'
import FormGrid from '@components/Forms/FormGrid.vue'
import FormInput from '@components/Inputs/FormInput.vue'
import { Input } from '@components/ui/input'
import { computed, onMounted, reactive, watch } from 'vue'
import { Switch } from '@components/ui/switch'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ApiClient } from '@/lib/apiClient'
import { useForm } from '@/composables/useForm'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@components/ui/button'
import { toast } from '@components/ui/toast'

const props = defineProps<{
    document: any
}>()

const emits = defineEmits(['save'])

const document = reactive({
    name: '',
    content: '',
    published: false,
})
function syncDocument() {
    console.log('syncDocument')
    if (!props.document) return
    let temp = JSON.parse(JSON.stringify(props.document))
    Object.keys(temp).forEach((key) => {
        document[key] = temp[key]
    })
}

const router = useRouter()
const route = useRoute()
const isEdit = route.params.slug !== 'new'
const url = isEdit
    ? `/legals-documents/${route.params.slug}`
    : '/legals-documents'

const payload = computed(() => document)
const { submit, errors } = useForm(url, payload, isEdit ? 'patch' : 'post')

function saveDocument() {
    submit((data) => {
        Object.keys(data.value).forEach((key) => {
            document[key] = data.value[key]
        })
        toast({
            title: 'Sauvegarde réussie',
        })
        emits('save')
        router.push({
            name: route.name,
            params: { slug: data.value.slug },
        })
    })
}

onMounted(syncDocument)
watch(() => props.document, syncDocument)
</script>

<template>
    <div class="m-6 mt-0">
        <Card>
            <CardHeader>
                <CardDescription> Informations générales </CardDescription>
            </CardHeader>
            <CardContent>
                <FormGrid class="mt-0 grid-cols-2 items-end">
                    <FormInput class="col-span-1" :errors="errors" name="name">
                        <template #label> Nom </template>
                        <Input
                            placeholder="Nom du document"
                            v-model="document.name"
                        />
                    </FormInput>
                    <FormInput variant="none" class="col-span-1">
                        <div class="flex items-center gap-4">
                            <Switch
                                :checked="document.published"
                                @update:checked="
                                    (e) => {
                                        document.published = e
                                    }
                                "
                            />
                            <Label>Publié</Label>
                        </div>
                    </FormInput>

                    <FormInput
                        variant="none"
                        class="col-span-2"
                        :errors="errors"
                        name="content"
                    >
                        <MdEditor v-model="document.content" language="fr-FR" />
                    </FormInput>
                    <div class="flex gap-4">
                        <Button @click="saveDocument">Enregistrer</Button>
                        <RouterLink
                            target="_blank"
                            :to="'/legal/' + document.slug"
                        >
                            <Button
                                type="button"
                                variant="outlineDashboard"
                                class="flex items-center gap-x-1 ml-0"
                            >
                                <ion-icon name="open-outline"></ion-icon>
                                Voir le document
                            </Button>
                        </RouterLink>
                    </div>
                </FormGrid>
            </CardContent>
        </Card>
    </div>
</template>

<style scoped></style>
