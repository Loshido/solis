import { define } from "utils";
import { LucideCog, LucideInfo, LucidePlug } from "lucide-preact"

import Button from "components/button.tsx";
import Channels from "islands/dash/channels.tsx";
import PwaButton from "islands/pwa.tsx";

export default define.page(() => {
    return <>
        {/* Navigation bar */}
        <header class="p-4 flex flex-row items-center justify-center relative">
            <div class="absolute top-0 left-4 flex flex-row items-center h-full gap-1 *:transition-colors">
                <PwaButton/>
                <Button>
                    <LucideInfo/>
                </Button>
            </div>
            <a href="/dash" class="font-bold text-2xl select-none cursor-pointer hover:text-solis">
                Solis
            </a>
            <nav class="absolute top-0 right-4 flex flex-row items-center h-full gap-1 *:transition-colors">
                <Button href="/dash/settings">
                    <LucideCog/>
                </Button>
                <Button>
                    <LucidePlug class="rotate-45"/>
                </Button>
            </nav>
        </header>

        <Channels/>
    </>
})