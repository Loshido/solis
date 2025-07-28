import type { JSX } from "preact";

interface Action {
    logo?: JSX.Element,
    label: string,
    action?: () => Promise<void> | void
    href?: string,
    enabled?: boolean
}

interface SettingProps {
    actions: Action[]
}
export default ({ actions }: SettingProps) => {
    return <main class="flex flex-col px-2 py-3 select-none">
        {
            actions.map((action, i) => <a key={i}
                href={action.href ? action.href : undefined}
                onClick={action.action ? action.action : undefined}
                class="flex flex-nowrap flex-row items-center gap-4 px-2 py-2 min-h-16 hover:bg-solis/5 rounded-xl cursor-pointer transition-colors">
                <div class={`h-16 w-16 rounded-xl aspect-square flex items-center justify-center transition-colors ${ !action.enabled ? ' bg-black/5 ' : ' bg-solis/25' }`}>
                    { action.logo }
                </div>
                <div class="flex flex-col h-full w-[calc(100% - 64px)] justify-between py-1">
                    <p class="text-xl">
                        { action.label }
                    </p>
                </div>
            </a>)
        }
    </main>
}