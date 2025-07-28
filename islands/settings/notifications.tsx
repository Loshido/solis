import Settings from "components/settings.tsx";
import { LucideClockArrowDown, LucideVibrate  } from "lucide-preact"
import { useSignal } from "@preact/signals";

export default () => {
    const realtime = useSignal(true)
    const push = useSignal(true)

    return <Settings
        actions={[
            {
                label: "Realtime Notifications",
                logo: <LucideClockArrowDown class="w-6 h-6"/>,
                action: () => {
                    realtime.value = !realtime.value
                    console.log('realtime notif')
                },
                enabled: realtime.value
            },
            {
                label: "Push Notifications",
                logo: <LucideVibrate class="w-6 h-6"/>,
                action: () => {
                    push.value = !push.value
                    console.log('push notif')
                },
                enabled: push.value
            },
        ]} 
    />
}