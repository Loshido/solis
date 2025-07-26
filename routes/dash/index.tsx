import { define } from "utils";
import { LucideCog, LucideInfo, LucidePlug, LucidePackagePlus } from "lucide-preact"

import Searchbar from "components/dash/searchbar.tsx";
import ChannelInvitation from "components/channels/invitation.tsx";
import ChannelCard from "components/channels/card.tsx"


export default define.page(() => {
    return <>
        {/* Navigation bar */}
        <header class="p-4 flex flex-row items-center justify-center relative">
            <div class="absolute top-0 left-4 flex flex-row items-center h-full gap-1 *:transition-colors">
                <a class="rounded-full hover:bg-solis/10 group cursor-pointer">
                    <LucidePackagePlus class="w-10 h-10 p-2.5 group-hover:stroke-solis"/>
                </a>
                <a class="rounded-full hover:bg-solis/10 group cursor-pointer">
                    <LucideInfo class="w-10 h-10 p-2.5 group-hover:stroke-solis"/>
                </a>
            </div>
            <a href="/dash" class="font-bold text-2xl select-none cursor-pointer hover:text-solis">
                Solis
            </a>
            <nav class="absolute top-0 right-4 flex flex-row items-center h-full gap-1 *:transition-colors">
                <a href="/dash/settings" class="rounded-full hover:bg-solis/10 group cursor-pointer">
                    <LucideCog class="w-10 h-10 p-2.5 group-hover:stroke-solis"/>
                </a>
                <a class="rounded-full hover:bg-solis/10 group cursor-pointer">
                    <LucidePlug class="w-10 h-10 p-2.5 rotate-45 group-hover:stroke-solis"/>
                </a>
            </nav>
        </header>

        {/* Search bar */}
        <div class="mx-4 my-2">
            <Searchbar 
            onUpdate={async (input) => {
                console.info(input)
            }} 
            />
        </div>

        {/* Channels invitations */}
        <section>
            <h2 class="text-2xl font-bold px-4 my-4 select-none">
                Channels invitations
            </h2>
            {
                [0, 1, 2].map((_, i) => <ChannelInvitation 
                    key={i}
                    name={`Channel ${ i + 1 }`}
                    onAccept={async () => {
                        
                    }}
                    onDeny={async () => {
                        
                    }}/>)
            }
        </section>

        {/* Channels */}
        <section>
            <h2 class="text-2xl font-bold mx-4 my-6 select-none">
                Channels
            </h2>
            <main class="grid grid-cols-2 gap-4 gap-y-6 p-2 mx-4">
                {
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                        .map((_, i) => <ChannelCard
                            key={i}
                            href={`/dash/${i}`}
                            name={`Channel ${ i  + 1 }`}
                            image="/fav.png"/>)
                }
            </main>
        </section>
    </>
})