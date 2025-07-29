import { define } from "utils";
import SlideDash from "islands/dash/slide-to-dash.tsx";

import IndividualHeader from "islands/dash/individual/header.tsx"
import IndividualMessages from "islands/dash/individual/messages.tsx"
import kv, { type Channel, type User } from "services/kv.ts";
import { page } from "fresh";
import { CHANNELS_PATH } from "services/env.ts";

interface PassingData {
    channel: Channel,
    origin: string,
    plain: string
}

export const handler = define.handlers<PassingData>(async ctx => {
    const { payload } = ctx.state
    if(!payload || ctx.params.channel.length === 0) return ctx.redirect('/')
    
    const db = await kv()
    
    const [ { value: user }, { value: channel } ] = await db.getMany<[User, Channel]>([
        ['users', payload.username],
        ['channels', ctx.params.channel]
    ])
    db.close()
    
    if(!user || !channel || !user.channels.includes(channel.id)) {
        return ctx.redirect('/dash')
    }
    
    const path = CHANNELS_PATH + channel.id
    const plain = Deno.readTextFileSync(path)
    
    return page({ channel, origin: ctx.url.origin, plain })
})

export default define.page<never, PassingData>(({ data }) => {
    return <SlideDash>
        <IndividualHeader
            channel={data.channel}/>
        
        <IndividualMessages 
            help={`try to send data over \n${data.origin}/ch/${ data.channel.id }`}
            messages={
                data.plain.length > 0
                ? data.plain.split('\n').map(m => {
                    const i = m.indexOf(' ')
                    return [m.slice(0, i), m.slice(i)]
                })
                : []
            }/>
    </SlideDash>
})