import Searchbar from "components/dash/searchbar.tsx";
import ChannelInvitation from "components/channels/invitation.tsx";
import ChannelCard from "components/channels/card.tsx"

export default () => {
    return <>
        {/* Search bar */}
        <div class="mx-4 my-2">
            <Searchbar 
                // deno-lint-ignore require-await
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
}