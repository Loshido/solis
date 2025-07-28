import Settings from "components/settings.tsx";
import { LucideContactRound, LucideTrash2, LucideLogOut } from "lucide-preact"

export default () => <Settings
    actions={[
        {
            label: "Change username",
            logo: <LucideContactRound class="w-6 h-6"/>,
            action: () => {
                console.log('rename')
            }
        },
        {
            label: "Disconnect",
            logo: <LucideLogOut class="w-6 h-6"/>,
            action: async () => {
                const response = await fetch('/auth/logout')
                if(response.ok) location.assign('/')
            }
        },
        {
            label: "Delete account",
            logo: <LucideTrash2 class="w-6 h-6"/>,
            action: () => {
                console.log('delete')
            }
        },
    ]} 
/>