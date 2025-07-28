import Searchbar from "components/dash/searchbar.tsx";
import ChannelInvitation from "components/channels/invitation.tsx";
import ChannelCard from "components/channels/card.tsx"
import { LucidePlug } from "lucide-preact"

import type { Channel } from "services/kv.ts";
import { useSignal } from "@preact/signals";

interface Props {
    invitations: Channel[]
    channels: Channel[]
}

export default ({ channels, invitations }: Props) => {
    const search = useSignal('')
    return <>
        {/* Search bar */}
        <div class="mx-4 my-2">
            <Searchbar 
                onUpdate={(input) => {
                    search.value = input
                }} 
            />
        </div>

        {/* Channels invitations */}
        {
            invitations.length > 0 && <section>
                <h2 class="text-2xl font-bold px-4 my-4 select-none">
                    Channels invitations
                </h2>
                {
                    invitations.map((inv, i) => <ChannelInvitation 
                        key={i}
                        name={inv.id}
                        onAccept={async () => {
                            // 
                        }}
                        onDeny={async () => {
                            // 
                        }}/>)
                }
            </section>
        }
        
        
        {/* Channels */}
        <section>
            <h2 class="text-2xl font-bold mx-4 my-6 select-none">
                Channels
            </h2>
            <main class="grid grid-cols-2 gap-4 gap-y-6 p-2 mx-4">
                {
                    channels.length > 0
                    ? channels
                        .filter(ch => ch.id.includes(search.value))
                        .map((ch, i) => <ChannelCard
                            key={i}
                            href={`/dash/${ ch.id }`}
                            name={ ch.id }
                            image={ ch.image }
                            color={ ch.color }/>)
                    : <div class="w-full col-span-2 text-center  font-medium text-black/50">
                        <p>
                            It seems like you have no channels, 
                        </p>
                        <p class="text-xs align-baseline flex flex-row gap-2 items-center justify-center">
                            try to create one
                            <LucidePlug class="w-4 h-4 rotate-45 -z-10 isolate"/>
                        </p>
                    </div>
                }
            </main>
        </section>
    </>
}