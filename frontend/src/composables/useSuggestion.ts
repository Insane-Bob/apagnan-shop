import {useFetch} from "@/composables/useFetch";
import {computed, onMounted, ref} from "vue";
import type {Ref} from "vue"
import type {Suggestion} from "@/types/Suggestion";



export function  useSuggestion<T extends Suggestion>(exceptSlugs: string[] = [],size : number = 3, type : string = 'collections')
    : {items: Ref<T[]>, fetch: ()=>void}
{
    const limit = computed(()=>{
        const unique = [...new Set(exceptSlugs)]
        return size + unique.length
    })

    const items = ref<Suggestion[]>([])
    const url = computed(()=>`/${type}?limit=${limit.value}&random=true&withCollection&withImages&withImage`);
    const fetcher = useFetch(url,null,(data)=>{
        items.value = data.data.filter((c: Suggestion) => !exceptSlugs.includes(c.slug)).splice(0, size)
    })

    onMounted(fetcher.get)
    return {
        items,
        fetch: fetcher.get
    }
}
