import Settings from "components/settings.tsx";
import { LucideMonitorSmartphone } from "lucide-preact"

export default () => <Settings
    actions={[
        {
            label: "Connected devices",
            logo: <LucideMonitorSmartphone class="w-6 h-6"/>,
            action: () => {
                console.log('rename')
            }
        },
    ]} 
/>