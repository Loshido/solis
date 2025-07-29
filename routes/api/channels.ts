import { define } from "utils";
import isAuthentificated from "services/cookie.ts"
import { BUCKET_PATH } from "services/env.ts";
import sharp from "sharp"
import log from "services/log.ts";
import kv, { type Channel, type User } from "services/kv.ts";

function parseChannel(form: FormData): Omit<Channel, 'image' | 'owner'> & { image?: File } | null  {
    const image = form.get('image') as File | null
    const id = form.get('id') as string | null
    const description = form.get('description') as string | null
    const color = form.get('color') as `#${string}` | null

    if(!id || !description || id.length <= 4 || description.length == 0) {
        return null
    }

    return {
        id: id.trim(),
        description,
        color: color ? color : undefined,
        image: image instanceof File ? image : undefined 
    }
}

export const handler = define.handlers({
    async POST(ctx) {
        const verified = await isAuthentificated(ctx.req)
        if(!verified) return new Response('Unauthorized', {
            status: 401
        })

        const body = await ctx.req.formData()
        const partial = parseChannel(body)
        if(!partial) return new Response('Missing field', {
            status: 400
        })

        const db = await kv()

        if((await db.get(['channels', partial.id])).value) {
            db.close()
            return new Response(`channel ${partial.id} already exists.`, {
                status: 400
            })
        }

        const { value: user } = await db.get<User>(['users', verified.username])
        if(!user) {
            db.close()
            return new Response(`user ${ verified.username } doesn't exist in database.`, { 
                status: 400
            })
        }

        if(partial.image) {
            const path = BUCKET_PATH + partial.id + '.png'
            sharp(await partial.image.bytes())
                .resize(256, 256, {
                    fit: 'cover'
                })
                .toBuffer((err, buffer) => {
                    if(err) {
                        log('api', `sharp failed to resize ()`, 'ERROR')
                        return
                    }
                    Deno.writeFileSync(path, buffer)
                    log('api', `channel ${ partial.id }'s image has been uploaded to "${path}" by ${ verified.username }`, 'TRACE')
                })
        }

        const channel: Channel = {
            ...partial,
            owner: verified.username,
            image: '/bucket/' + partial.id + '.png'
        }
        
        user.channels.push(channel.id)
        await db.set(['channels', channel.id], channel)
        await db.set(['users', verified.username], user)

        log('api', `channel ${ channel.id } has been created by ${ verified.username }`, 'INFO')
        return new Response('ok', {
            status: 200
        })
    }
})