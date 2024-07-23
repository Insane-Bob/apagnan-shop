<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import Label from "@components/ui/label/Label.vue";
import OutlinedInput from "@components/ui/input/OutlinedInput.vue";
import Button from "@components/ui/button/Button.vue";
import {ApiClient} from "@/lib/apiClient.ts";
import CardDescription from "@components/ui/card/CardDescription.vue";
import {useToast} from "@components/ui/toast/index.ts";

const props = defineProps({
  label: {
    type: String,
    default: "Images",
  },
  multiple: {
    type: Boolean,
    default: true,
  },
});

const model = defineModel()

const {toast} = useToast()

const images = reactive([]);

function syncImagesWithModel(){
  if(model.value.length === images.length) return
  model.value.forEach(image => {
    images.push({inputFile:null,api:image});
  })
}

function syncModelWithImages(){
  model.value = images.map(image => image.api)
}


onMounted(()=>{
  if(!props.multiple && model.value.length === 0){
    addImage()
  }else{
    syncImagesWithModel()
  }
})

watch(model,syncImagesWithModel)

function addImage(){
  images.push({inputFile:null,api:null,preview:null,uploadProgress:-1});
}
function removeImage(index){
  if(props.multiple){
    images.splice(index,1)
  }else{
    images[index] = {inputFile:null,api:null,preview:null,uploadProgress:-1}
  }
    syncModelWithImages()
}
async function handleInputFile(e,index){
  let files = Array.from(e.target.files)
  if(files.length === 0) return
  let i = index

  for(let f of files){
    if(!images[i]) images.push({inputFile:null,api:null,preview:null,uploadProgress:-1})
    images[i].inputFile = f

    const reader = new FileReader()
    let promise = new Promise((resolve)=>{
      reader.readAsDataURL(f)
      reader.onload = (e) => {
        images[i].preview = e.target.result
        resolve()
      }
    })
    await promise
    i++
  }
}
async function handleSave(){
  let apiClient = new ApiClient()
  let tasks = images.map(async (image,index) => {
    if(!image.inputFile) return
    let form = new FormData()
    form.append('file', image.inputFile)
    try{
      const response = await apiClient.post('/uploads',form,{
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          images[index].uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      })
      images[index].api = response.data.file
    }catch (e){
      images[index].uploadProgress = -2
      toast({
        title:"Une erreur est survenue lors du téléversement de l'image",
        variant:"destructive"
      })
    }
    syncModelWithImages()
  })

  await Promise.all(tasks)

  toast({
    title:"Téléversement terminé",
  })
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center ">
      <CardDescription>
        {{props.label}}
      </CardDescription>
      <Button class="flex gap-2" variant="outlineDashboard" @click.stop.prevent="addImage" v-if="props.multiple">
        <ion-icon name="add-outline"></ion-icon>
        Ajouter une image
      </Button>
    </div>

    <div class="grid gap-8 my-4" :class="[props.multiple ? 'grid-cols-3' : 'grid-cols-1']">
      <div v-for="(image,index) in images" :key="'image-' + index" class="col-span-1 flex items-stretch gap-2 bg-slate-50 p-2 border-2 border-dashed rounded">
        <div class="w-full items-center h-full min-h-[100px] relative grid" v-if="!image.api">
          <Label for="picture" class="mb-3 inline-block">Image N°{{index + 1}}
            <span class="uppercase text-xs text-slate-500">
                {{ image.uploadProgress == -2 ? '(erreur de téléversement)' : '(non téléversé)'}}
            </span>
          </Label>
          <div v-if="image.preview">
            <img :src="image.preview" alt="img" class="h-[100px] w-[100px] object-contain object-center p-2">
          </div>
          <template v-else>
            <input type="file" :multiple="props.multiple" @input="(e)=>handleInputFile(e,index)" class="opacity-0 absolute top-0 left-0 right-0 bottom-0 cursor-pointer">
            <OutlinedInput id="picture" type="file" class="hidden mt-[60px]"  />
            <ion-icon name="cloud-upload-outline" class="text-[3em] pointer-events-none text-slate-500 relative left-[50%] top-[-10%] translate-x-0.5 -translate-y-0.5"></ion-icon>
          </template>
          <span v-if="image.uploadProgress >= 0  && image.uploadProgress < 100" class="text-blue text-xs">
              Téléversement en cours: {{image.uploadProgress}}%
            </span>
        </div>
        <div v-else>
          <Label for="picture" class="mb-3 inline-block">Image N°{{index + 1}}</Label>
          <img :src="image.api.url" alt="img" class="h-[100px] w-[100px] object-contain object-center bg-white rounded p-2">
        </div>
        <Button size="icon" variant="outlineDashboard" @click.stop.prevent="()=>removeImage(index)">
          <ion-icon name="remove-outline"></ion-icon>
        </Button>
      </div>
    </div>

    <Button v-if="images.some(i => i.uploadProgress === -1)" class="flex gap-2 ml-0 mt-3" @click.stop.prevent="handleSave" variant="outlineDashboard">
      <ion-icon name="cloud-upload-outline"></ion-icon>
      <span>Téléverser</span>
    </Button>

  </div>
</template>
