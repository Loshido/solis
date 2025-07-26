import { define } from "utils";
import { LucideChevronLeft, LucideClockArrowDown, LucideVibrate  } from "lucide-preact"
import Button from "components/button.tsx";

export default define.page(() => {
    return <>
        {/* Navigation bar */}
        <header class="p-4 flex flex-row items-center justify-center relative">
            <nav class="absolute top-0 left-4 flex flex-row items-center h-full gap-1 *:transition-colors">
                <Button href="/dash/settings">
                    <LucideChevronLeft/>
                </Button>
            </nav>
            <a class="font-bold text-2xl select-none">
                Notifications
            </a>
        </header>

        {/* Actions */}
        <main class="flex flex-col px-2 py-3 select-none">
            <div 
                class="flex flex-nowrap flex-row items-center gap-4 px-2 py-2 min-h-16
                    hover:bg-solis/5 rounded-xl cursor-pointer transition-colors">
                <div class="h-16 w-16 bg-black/5 rounded-xl aspect-square flex items-center justify-center">
                    <LucideClockArrowDown class="w-6 h-6"/>
                </div>
                <div class="flex flex-col h-full w-[calc(100% - 64px)] items-center py-1">
                    <p class="text-xl">
                        Realtime Notifications
                    </p>
                </div>
            </div>
            <div 
                class="flex flex-nowrap flex-row items-center gap-4 px-2 py-2 min-h-16
                    hover:bg-solis/5 rounded-xl cursor-pointer transition-colors">
                <div class="h-16 w-16 bg-black/5 rounded-xl aspect-square flex items-center justify-center">
                    <LucideVibrate class="w-6 h-6"/>
                </div>
                <div class="flex flex-col h-full w-[calc(100% - 64px)] items-center py-1">
                    <p class="text-xl">
                        Push Notifications
                    </p>
                </div>
            </div>
        </main>
    </>
})