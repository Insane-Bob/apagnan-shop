<script setup lang="ts">

import ProfileLayout from "@/layout/ProfileLayout.vue";
import CardHeader from "@components/ui/card/CardHeader.vue";
import Card from "@components/ui/card/Card.vue";
import CardTitle from "@components/ui/card/CardTitle.vue";
import CardContent from "@components/ui/card/CardContent.vue";
import CardDescription from "@components/ui/card/CardDescription.vue";
import Button from "@components/ui/button/Button.vue";
import Separator from "@components/ui/separator/Separator.vue";
import {NotificationSubscriptionType, useUserNotificationsStore} from "@/stores/userNotificationsStore";
import {computed} from "vue";
import ConfirmationModal from "../Modals/ConfirmationModal.vue";

const notificationStore = useUserNotificationsStore();

const totalProductAlerts = computed(()=>{
  return notificationStore?.preferences[NotificationSubscriptionType.PRODUCT_RESTOCK].ids.length + notificationStore?.preferences[NotificationSubscriptionType.PRODUCT_PRICE_CHANGE].ids.length;
})

const totalCollectionAlerts = computed(()=>{
  return notificationStore?.preferences[NotificationSubscriptionType.NEW_PRODUCT].ids.length;
})

function disableAllProductAlerts(){
  notificationStore.setNotificationPreference(false, NotificationSubscriptionType.PRODUCT_RESTOCK);
  notificationStore.setNotificationPreference(false, NotificationSubscriptionType.PRODUCT_PRICE_CHANGE);
}

function disableAllCollectionAlerts(){
  notificationStore.setNotificationPreference(false, NotificationSubscriptionType.NEW_PRODUCT);
}

</script>

<template>
<ProfileLayout>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-3">
        <ion-icon name="notifications-outline"></ion-icon>
        Gestions des alertes
      </CardTitle>
      <CardDescription>
        Vous pouvez réinitialiser vos alertes ici
      </CardDescription>
    </CardHeader>
    <CardContent v-if="notificationStore.preferences" >
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-6">
          <h3>Alertes produits</h3>
         <template v-if="totalProductAlerts">
           <CardDescription>
             Vous avez actuellement <span class="font-medium">{{totalProductAlerts}}</span> alertes produits actives
           </CardDescription>
           <div class="flex gap-6">
             <Button size="sm" variant="tone" @click="notificationStore.setNotificationPreference(false,NotificationSubscriptionType.PRODUCT_RESTOCK)">
               Désactiver les alertes de stock ({{notificationStore.preferences[NotificationSubscriptionType.PRODUCT_RESTOCK].ids.length}})
             </Button>

             <Button size="sm" variant="tone" @click="notificationStore.setNotificationPreference(false,NotificationSubscriptionType.PRODUCT_PRICE_CHANGE)">
               Désactiver les alertes de prix ({{notificationStore.preferences[NotificationSubscriptionType.PRODUCT_PRICE_CHANGE].ids.length}})
             </Button>
           </div>
           <ConfirmationModal @confirm="disableAllProductAlerts"
          title="Voulez-vous vraiment enlever toutes les notifications"
          message="Cette action est enlevera toutes les notifications, vous pourrez toujours les réactiver plus tard"
          style-confirm="bg-red-500"
          >
            <Button size="sm" variant="tone-danger">
              <ion-icon name="notifications-off"></ion-icon>
              Désactiver toutes les alertes produits ({{totalProductAlerts}})
            </Button>
          </ConfirmationModal>
         </template>
          <CardDescription v-else>
            Vous n'avez pas d'alertes produits active
          </CardDescription>
        </div>
        <Separator/>
        <div class="flex flex-col gap-6">
          <h3>Alertes Collection</h3>
          <template v-if="totalCollectionAlerts">
            <CardDescription >
              Vous avez actuellement <span class="font-medium">{{totalCollectionAlerts}}</span> alertes produits actives
            </CardDescription>
            <Button size="sm" variant="tone-danger" @click="disableAllCollectionAlerts">
              <ion-icon name="notifications-off"></ion-icon>
              Désactiver toutes les alertes collections
            </Button>
          </template>
          <CardDescription v-else>
            Vous n'avez pas d'alertes collection active
          </CardDescription>
        </div>
      </div>
    </CardContent>
  </Card>
</ProfileLayout>
</template>

<style scoped>

</style>