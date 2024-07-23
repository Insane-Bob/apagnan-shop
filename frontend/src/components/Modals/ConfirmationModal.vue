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

const props = defineProps<{
  title?: string;
  message?: string;
  styleFooter?: string;
  styleConfirm?: string;
  styleCancel?: string;
}>();
</script>


<template>
    <AlertDialog>
        <AlertDialogTrigger>
            <slot></slot>
        </AlertDialogTrigger>
      <AlertDialogContent class="w-[30–vw]">
        <AlertDialogHeader>
          <AlertDialogTitle>{{  props.title || 'Êtes vous sûr?' }}</AlertDialogTitle>
          <AlertDialogDescription>
            {{ props.message || 'Cette action a des effet permanents.' }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter class="flex items-center sm:justify-end w-full px-10" :class="styleFooter">
          <AlertDialogCancel :class="styleCancel" @click="$emit('cancel')">Cancel</AlertDialogCancel>
          <AlertDialogAction :class="styleConfirm" @click="$emit('confirm')">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </template>