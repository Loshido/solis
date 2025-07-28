import Settings from "components/settings.tsx";
import { LucideMonitorSmartphone } from "lucide-preact"
import Slide from "../slide.tsx";

export default () => <Slide
    onSlideLeft={() => {
        location.assign('/dash/settings')
    }}>
    <Settings
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
</Slide>