import {backofficeRoutesName} from "@/routes/backoffice";
import {onUnmounted} from "vue";
import {useRouter} from "vue-router";

export function usePaymentBroadcastChannel(customCallback = (data)=>{}){
    const channel = new BroadcastChannel('payment')
    const router = useRouter()
    channel.onmessage = (event) => {
        customCallback(event.data)
        router.push({
            name:backofficeRoutesName.COMMAND_RESUME,
            params: { id: event.data.orderId },
            query: { status: event.data.status }
        })

    }

    onUnmounted(() => {
        channel.close()
    })

    function send(data){
        channel.postMessage(data)
    }

    return {send}
}
