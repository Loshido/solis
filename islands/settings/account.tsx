import Settings from "components/settings.tsx";
import { LucideContactRound, LucideTrash2, LucideLogOut } from "lucide-preact"
import { useSignal } from "@preact/signals";
import Confirmation from "components/dialogs/confirmation.tsx";
import Slider from "components/slider.tsx";

export default () => {
    const delete_dialog = useSignal(false)
    const loading = useSignal(false)

    return <Settings
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
                    delete_dialog.value = true
                },
            },
        ]}
        dialog={<>
            {
                delete_dialog.value && <Confirmation
                    yes={{
                        color: 'bg-red-600/15 text-red-600/60 hover:bg-red-600/45 duration-500',
                        action: async () => {
                            delete_dialog.value = false
                            loading.value = true
                            const response = await fetch('/api/delete-account', {
                                credentials: 'same-origin'
                            })
                            loading.value = false
                            if(response.ok) location.assign('/')
                        }
                    }}
                    no={{
                        action: () => {delete_dialog.value = false}
                    }}
                    prompt="Do you want to delete your account?"/> 
            }
            {
                loading.value && <div class="blurrish absolute top-0 left-0 w-dvw h-dvh 
                    flex items-center justify-center backdrop-blur-sm bg-white/25 cursor-progress">
                    <Slider/>
                </div>
            }
        </>}
    />
}