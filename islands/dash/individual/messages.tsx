interface Props {
    messages: [string, string][],
    help?: string
}

export default ({ messages, help }: Props) => {
    return <>
        {/* Messages */}
        <main class="flex flex-col py-2">
            {
                messages.length > 0
                ? messages
                    .map(([date, message], i) => <div key={i} 
                        class="flex flex-nowrap flex-row items-start gap-4 px-4 py-1 min-h-16">
                        {/* <div class="h-16 w-16 bg-black/5 rounded-xl aspect-square flex items-center justify-center">
                            <LucideAirVent class="w-6 h-6"/>
                        </div> */}
                        <div class="flex flex-col h-full w-full justify-between py-1">
                            <p class="text-sm max-w-full wrap-anywhere whitespace-pre-wrap">
                                { JSON.parse(message) }
                            </p>
                            <p class="font-light text-xs">
                                { 
                                    new Date(parseInt(date)).toLocaleString('fr-FR', {
                                        timeStyle: 'short',
                                        dateStyle: 'short'
                                    }) 
                                }
                            </p>
                        </div>
                    </div>)
                : <div class="w-full col-span-2 text-center my-32 font-medium text-black/50">
                    <img src="/img/dino.png" alt="Lonely dino..." class="w-1/2 mx-auto"/>
                    <pre class="mt-4 text-xs align-baseline flex flex-row gap-2 items-center justify-center font-jetbrain">
                        { help }
                    </pre>
                </div>
            }
        </main>
    </>
}