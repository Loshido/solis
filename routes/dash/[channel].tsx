import { define } from "utils";
import { LucideChevronLeft, LucideAirVent, LucideSquarePen, LucideCopy, LucideUsers } from "lucide-preact"
import Button from "components/button.tsx";

export default define.page((props) => {
    return <>
        {/* Navigation bar */}
        <header class="p-4 h-16 flex flex-row items-center justify-center relative">
            <nav class="absolute top-0 left-4 flex flex-row gap-2 items-center h-full *:transition-colors">
                <Button href="/dash">
                    <LucideChevronLeft/>
                </Button>
                <a class="font-bold text-lg select-none">
                    { props.params.channel }
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
            Description du channel, cette description peut être longue ou pas, mais il doit y avoir de l'espace ici.
        </p>

        {/* Messages */}
        <main class="flex flex-col py-2">
            {
                [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0]
                    .map((_, i) => <div key={i} 
                        class="flex flex-nowrap flex-row items-start gap-4 px-4 py-2 min-h-16">
                        <div class="h-16 w-16 bg-black/5 rounded-xl aspect-square flex items-center justify-center">
                            <LucideAirVent class="w-6 h-6"/>
                        </div>
                        <div class="flex flex-col h-full w-[calc(100% - 64px)] justify-between py-1">
                            <p class="text-sm">
                                Message N°{ i + 1 } Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            </p>
                            <p class="font-light text-xs">
                                { new Date().toLocaleString('fr-FR') }
                            </p>
                        </div>
                    </div>)
            }
        </main>
    </>
})