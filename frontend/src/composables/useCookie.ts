import { computed, type ComputedRef, onMounted, onUnmounted, reactive, ref } from 'vue'




type CookiePreference = {
  name: string,
  label : string,
  description: string,
  value: boolean
}[]


export function useCookie() : {
  cookiePreferences: CookiePreference,
  setCookie: (name:string, value:boolean) => void
  disableAll: () => void
  activeAll: () => void
  isActive: ComputedRef<(name:string) => boolean | undefined>
  refresh: ()=> void
  setCookieHasBeenAsked: () => void,
  hasBeenAsked: ComputedRef<boolean>
} {

  const hasBeenAsked = ref(document.cookie.includes('cookieHasBeenAsked=true'))

  const cookiePreferences  = reactive<CookiePreference>([
      {
        name:'functional',
        label: 'Cookies fonctionnels (obligatoire)',
        description: 'Ces cookies sont nécessaires au bon fonctionnement du site web.',
        value : true,
        disabled: true
      },
      {
        name: 'hCaptcha',
        label: 'hCaptcha (nécessaire pour la connexion)',
        description: 'hCaptcha est un service de protection contre les robots et les abus. Il assure la sécurité de nos formulaires de connexion et protège l\'accès a votre compte.',
        value: false
      }
    ]
  )

  function loadFromCookies(sync=true){
    const cookieString = document.cookie
    const cookies = cookieString.split(';')
    const cookiePreferenceString = cookies.find(cookie => cookie.includes('cookiePreference'))
    const cookiePreferencesFromCookies = cookiePreferenceString?.split('=')[1].split('-').map(cookie => ({
      name: cookie.split(':')[0],
      value: cookie.split(':')[1] === 'true'
    }))
    if(cookiePreferencesFromCookies){
      cookiePreferencesFromCookies.forEach(cookie => {
        const index = cookiePreferences.findIndex(option => option.name === cookie.name)
        if(index !== -1){
          cookiePreferences[index].value = cookie.value
        }
      })
    }
    if(sync) syncCookies()
  }

  onMounted(loadFromCookies)

  function syncCookies(){
    const cookieString =  cookiePreferences.reduce((acc,option) => {
      return acc + `${option.name}:${option.value}--`
    },'')
    document.cookie = 'cookiePreference='+cookieString
    window.dispatchEvent(new Event('cookiePreferenceChange'))
  }

  function disableAll(){
    cookiePreferences.forEach(option => {
      if(!option.disabled){
        option.value = false
      }
    })
    syncCookies()
  }

  function activeAll(){
    cookiePreferences.forEach(option => {
      if(!option.disabled){
        option.value = true
      }
    })
    syncCookies()
  }
  function setCookie(name:string, value:boolean){
    let index = cookiePreferences.findIndex(option => option.name === name)
    if(index === -1) return
    cookiePreferences[index].value = value
    syncCookies()
  }

  const isActive = computed(()=>{
    return (name:string) => {
      return cookiePreferences.find(option => option.name === name)?.value
      syncCookies()
    }
  })

  function setCookieHasBeenAsked(){
    document.cookie = 'cookieHasBeenAsked=true'
    hasBeenAsked.value = true
  }


  function handleChange(){
    loadFromCookies(false)
  }

  onMounted(()=>{
    window.addEventListener('cookiePreferenceChange', handleChange)
  })

  onUnmounted(()=>{
    window.removeEventListener('cookiePreferenceChange', handleChange)
  })

  return {
    cookiePreferences,
    setCookie,
    disableAll,
    activeAll,
    isActive,
    refresh: syncCookies,
    setCookieHasBeenAsked,
    hasBeenAsked,
  }

}