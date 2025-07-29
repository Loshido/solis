import { LucideChevronLeft, LucideSquarePen, LucideCopy, LucideUsers } from "lucide-preact"
import Button from "components/button.tsx";
import { type Channel } from "services/kv.ts"

interface Props {
    channel: Channel
}

export default ({ channel }: Props) => {
    return <>
        {/* Navigation bar */}
        <header class="p-4 h-16 flex flex-row items-center justify-center relative">
            <nav class="absolute top-0 left-4 flex flex-row gap-2 items-center h-full *:transition-colors">
                <Button href="/dash">
                    <LucideChevronLeft/>
                </Button>
                <a class="font-bold text-lg select-none">
                    { channel.id }
                </a>
            </nav>
            <div class="absolute top-0 right-4 flex flex-row items-center h-full gap-1 *:transition-colors">
                <Button>
                    <LucideUsers/>
                </Button>
                <Button>
                    <LucideCopy/>
                </Button>
                <Button>
                    <LucideSquarePen/>
                </Button>
            </div>
        </header>
    
        {/* Channel's description */}
        <p class="px-4 text-sm text-center">
            {
                channel.description
            }
        </p>
    </>
}