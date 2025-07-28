import { define } from "utils";
import isAuthentificated from "services/cookie.ts";
import kv, { type Channel } from "services/kv.ts";
import log from "services/log.ts";

export const handler = define.handlers(async ctx => {
    const addr = ctx.info.remoteAddr
    const net = addr.transport === 'tcp' || addr.transport === 'udp'
    const origin = net ? `${addr.hostname}:${addr.port} via ${addr.transport.toUpperCase()}` : ''

    const verified = await isAuthentificated(ctx.req)
    if(!verified) {
        log('api', `Unauthorized client (${origin}) attempted /api/delete-account`, 'TRACE')
        return new Response('Unauthorized', { status: 401 })
    }

    const db = await kv()

    try {
        const op = db.atomic()
        op.delete(['credentials', verified.id]),
        op.delete(['users', verified.id])

        const channels = db.list<Channel>({ prefix: ['channels'] })
        for await (const channel of channels) {
            if(channel.value.owner === verified.id) {
                op.delete(['channels', channel.value.id])
            }
        }
        
        const operation = await op.commit()
        if(!operation.ok) throw { message: "Transaction failed" }

        
        log('api', `${verified.username}'s (${verified.id}) account deleted by` + origin, 'INFO')
    } catch(error) {
        console.log(error)
        return new Response(JSON.stringify(error), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        })
    } finally {
        db.close()
    }
    return new Response('ok')
})