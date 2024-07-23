<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'

const loading = ref(false)
const error = ref<string | null>(null)
const open = ref(false)

const props = defineProps<{
    title?: string
    message?: string
    styleFooter?: string
    styleConfirm?: string
    styleCancel?: string
    props?: any
    confirm: (props?: any) => void
}>()

const confirmAction = async () => {
    try {
        loading.value = true
        if (props.props) await props.confirm(props.props)
        else await props.confirm()

        loading.value = false
        open.value = false
    } catch (e: any) {
        switch (e.status) {
            case 500:
                error.value =
                    'Une erreur est survenue, Nous tentons de la résoudre, veuillez réessayer plus tard'
                break
            case 401:
                error.value =
                    "Vous n'avez pas les droits pour effectuer cette action"
                break
            default:
                error.value =
                    'Une erreur est survenue, veuillez réessayer plus tard'
        }
        loading.value = false
    }
}
</script>

<template>
    <AlertDialog v-model:open="open">
        <AlertDialogTrigger>
            <slot></slot>
        </AlertDialogTrigger>
        <AlertDialogContent class="w-[30vw] px-12 py-8">
            <AlertDialogHeader>
                <AlertDialogTitle>{{
                    props.title || 'Êtes vous sûr?'
                }}</AlertDialogTitle>
                <AlertDialogDescription v-if="!error">
                    {{
                        props.message || 'Cette action a des effet permanents.'
                    }}
                </AlertDialogDescription>
                <AlertDialogDescription v-if="error" class="text-red-500">
                    {{ error }}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter
                class="flex items-center sm:justify-end w-full"
                :class="styleFooter"
            >
                <AlertDialogCancel :class="styleCancel" @click="$emit('cancel')"
                    >Cancel</AlertDialogCancel
                >
                <Button
                    v-if="!loading && !error"
                    :class="styleConfirm"
                    @click.prevent="confirmAction"
                    >Continue</Button
                >
                <Button v-if="loading" class="bg-gray-300 cursor-not-allowed"
                    >Chargement...</Button
                >
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
