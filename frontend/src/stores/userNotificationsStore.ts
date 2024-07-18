import {defineStore} from "pinia";
import type {UserNotificationPreferences, UserNotificationPreferencesObject} from "@/types/UserNotificationPreferences";
import {useUserStore} from "@/stores/user";
import {apiClient} from "@/lib/apiClient";


export class NotificationSubscriptionType {
    static NEW_PRODUCT = 'new_product'
    static PRODUCT_RESTOCK = 'product_restock'
    static PRODUCT_PRICE_CHANGE = 'product_price_change'
}


export const useUserNotificationsStore = ()=>{
    const store = defineStore('userNotifications', {
        state: ()  => {
            return ({
                _preferences: {} as UserNotificationPreferencesObject,
                fetched: false,
                loading:false
            });
        },
        actions: {
            isActivate(modelId:number, type: string){
                if(!this.preferences) return false
                return this.preferences[type].ids.includes(modelId)
            },
            async fetchPreferences(){
                if(this.loading) return;
                this.loading = true
                const user = useUserStore()
                if(!user.isAuthenticated) return
                const response = await apiClient.get(`/users/${user.get.id}/notifications`)
                this._preferences = response.data
                this.fetched = true
                this.loading = false
            },
            async setNotificationPreference(active: boolean, type: string, modelId?: number, modelType?: string){
                const user = useUserStore()
                if(!user.isAuthenticated) return
                let body = {
                   activated: active
                }
                if(modelId && modelType){
                    body = {
                        ...body,
                        modelId,
                        modelType
                    }
                }
                const response = await apiClient.post(`/users/${user.get.id}/notifications/${type}`, body)
                await this.fetchPreferences()
            },

            getDropdownMenuItems(modelType,modelId){
                if(modelType == 'product'){
                    console.log('modelId', modelId)
                    console.log(this.preferences)
                    return [
                        {
                            action:() => {
                                this.setNotificationPreference(!this.isActivate(modelId, NotificationSubscriptionType.PRODUCT_RESTOCK), NotificationSubscriptionType.PRODUCT_RESTOCK, modelId, modelType)
                            },
                            type: NotificationSubscriptionType.PRODUCT_RESTOCK,
                            label: this.isActivate(modelId, NotificationSubscriptionType.PRODUCT_RESTOCK) ? 'Desactiver la notification de réapprovisionnement' : 'Activer la notification de réapprovisionnement',
                            icon: this.isActivate(modelId, NotificationSubscriptionType.PRODUCT_RESTOCK) ? 'notifications-off' : 'notifications'
                        },
                        {
                            action:() => {
                                this.setNotificationPreference(!this.isActivate(modelId, NotificationSubscriptionType.PRODUCT_PRICE_CHANGE), NotificationSubscriptionType.PRODUCT_PRICE_CHANGE, modelId, modelType)
                            },
                            type: NotificationSubscriptionType.PRODUCT_PRICE_CHANGE,
                            label: this.isActivate(modelId, NotificationSubscriptionType.PRODUCT_PRICE_CHANGE) ? 'Desactiver la notification de changement de prix' : 'Activer la notification de changement de prix',
                            icon: this.isActivate(modelId, NotificationSubscriptionType.PRODUCT_PRICE_CHANGE) ? 'notifications-off' : 'notifications'
                        }
                    ]
                }else if( modelType == 'collection'){
                    return [
                        {
                            action : ()=>{
                                this.setNotificationPreference(!this.isActivate(modelId, NotificationSubscriptionType.NEW_PRODUCT), NotificationSubscriptionType.NEW_PRODUCT, modelId, modelType)
                            },
                            type: NotificationSubscriptionType.NEW_PRODUCT,
                            label: this.isActivate(modelId, NotificationSubscriptionType.NEW_PRODUCT) ? 'Desactiver la notification de nouveaux produits' : 'Activer la notification de nouveaux produits',
                            icon: this.isActivate(modelId, NotificationSubscriptionType.NEW_PRODUCT) ? 'notifications-off' : 'notifications'

                        }
                    ]
                }
            }
        },

        getters:{
            preferences() : UserNotificationPreferencesObject | null {
                return Object.keys(this._preferences).length ? this._preferences : null
            },
        }
    })

    const instance = store()
    if(!instance.fetched) instance.fetchPreferences()
    return instance
}