import Button from "components/button.tsx";
import { LucidePackagePlus } from "lucide-preact";
import { useSignal, useSignalEffect } from "@preact/signals";

export default () => {
    const pwaPrompt = useSignal<Event | null>(null)
    useSignalEffect(() => {
        // deno-lint-ignore no-window-prefix no-window
        window.addEventListener("beforeinstallprompt", (event) => {
            event.preventDefault();
            pwaPrompt.value = event
        });
    })
    return pwaPrompt.value && <Button onClick={async () => {
        // @ts-ignore no matching types
        await pwaPrompt.value.prompt()
        pwaPrompt.value = null
    }}>
        <LucidePackagePlus/>
    </Button>
}