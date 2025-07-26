import { define } from "utils";
import { LucideChevronLeft, LucideUser, LucideBellRing, LucideShield  } from "lucide-preact"

export default define.page(() => {
    return <>
        {/* Navigation bar */}
        <header class="p-4 flex flex-row items-center justify-center relative">
            <nav class="absolute top-0 left-4 flex flex-row items-center h-full gap-1 *:transition-colors">
                <a href="/dash" class="rounded-full hover:bg-solis/10 group cursor-pointer">
                    <LucideChevronLeft class="w-10 h-10 p-2.5 group-hover:stroke-solis"/>
                </a>
            </nav>
            <a class="font-bold text-2xl select-none">
                Settings
            </a>
        </header>

        {/* Actions */}
        <main class="flex flex-col px-2 py-3 select-none">
            <a href="/dash/settings/account"
                class="flex flex-nowrap flex-row items-start gap-4 px-2 py-2 min-h-16
                    hover:bg-solis/5 rounded-xl cursor-pointer transition-colors">
                <div class="h-16 w-16 bg-black/5 rounded-xl aspect-square flex items-center justify-center">
                    <LucideUser class="w-6 h-6"/>
                </div>
                <div class="flex flex-col h-full w-[calc(100% - 64px)] justify-between py-1">
                    <p class="text-xl">
                        Account
                    </p>
                    <p class="font-light text-sm">
                        Manage your account details
                    </p>
                </div>
            </a>
            <a href="/dash/settings/notifications"
                class="flex flex-nowrap flex-row items-start gap-4 px-2 py-2 min-h-16
                    hover:bg-solis/5 rounded-xl cursor-pointer transition-colors">
                <div class="h-16 w-16 bg-black/5 rounded-xl aspect-square flex items-center justify-center">
                    <LucideBellRing class="w-6 h-6"/>
                </div>
                <div class="flex flex-col h-full w-[calc(100% - 64px)] justify-between py-1">
                    <p class="text-xl">
                        Notifications
                    </p>
                    <p class="font-light text-sm">
                        Customize your notification preferences
                    </p>
                </div>
            </a>
            <a href="/dash/settings/security"
                class="flex flex-nowrap flex-row items-start gap-4 px-2 py-2 min-h-16
                    hover:bg-solis/5 rounded-xl cursor-pointer transition-colors">
                <div class="h-16 w-16 bg-black/5 rounded-xl aspect-square flex items-center justify-center">
                    <LucideShield class="w-6 h-6"/>
                </div>
                <div class="flex flex-col h-full w-[calc(100% - 64px)] justify-between py-1">
                    <p class="text-xl">
                        Security
                    </p>
                    <p class="font-light text-sm">
                        Enhance your account security
                    </p>
                </div>
            </a>
        </main>
    </>
})