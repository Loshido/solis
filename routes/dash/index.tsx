import { define } from "utils";
import { page } from "fresh";
import { LucideCog, LucideInfo } from "lucide-preact"

import Button from "components/button.tsx";
import Channels from "islands/dash/channels.tsx";
import PwaButton from "islands/pwa.tsx";
import CreateChannel from "islands/dash/create-channel.tsx";

import kv, { type User, type Channel } from "services/kv.ts"
import log from "services/log.ts";

interface PageProps {
    channels: Channel[], 
    invitations: Channel[]
}

export const handler = define.handlers(async ctx => {
    const { payload } = ctx.state
    if(!payload) return ctx.redirect('/')
    
    const db = await kv()
    const { value: user } = await db.get<User>(['users', payload.username])
    if(!user) {
        log(
            'middleware', 
            `${ payload.username } (${ payload.id }) is authentificated but not in database.`, 
            'INFO'
        )
        return ctx.redirect('/')
    }

    const [ channels, invitations ] = await Promise.all([
        db.getMany(user.channels.map(ch => (['channels', ch]))),
        db.getMany(user.invitations.map(ch => (['channels', ch]))),
    ])

    
    return page({ channels: channels.map(ch => ch.value), invitations: invitations.map(ch => ch.value) })
})

export default define.page<never, PageProps>(({ data }) => {
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
                <CreateChannel/>
            </nav>
        </header>

        <Channels
            channels={data.channels}
            invitations={data.invitations}/>
    </>
})