import { define } from "utils";
import { encodeBase64Url } from "@std/encoding/base64url"
import kv, { type User } from "services/kv.ts";
import { RP_ID, RP_NAME } from "services/env.ts";

export const handler = define.handlers(async ctx => {
    const username = ctx.url.searchParams.get('username')
    if(!username || username.length < 6) {
        return new Response(`You must provide a valid username`, {
            status: 400
        })
    }

    const db = await kv()
    const entries = db.list<User>({ prefix: ['users'] })
    for await (const entry of entries) {
        if(entry.value.username === username) {
            db.close()
            return new Response(`${username}'s account already exists!`, {
                status: 400
            })
        }
    }

    const id = crypto.randomUUID()
    const options = {
        challenge: encodeBase64Url(crypto.getRandomValues(new Uint8Array(32)).buffer),
        rp: {
            name: RP_NAME,
            id: RP_ID
        },
        user: {
            id: encodeBase64Url(new TextEncoder().encode(id)),
            name: username.toLowerCase(),
            displayName: username
        },
        pubKeyCredParams: [
            {
                alg: -7,
                type: 'public-key'
            },
            {
                alg: -257,
                type: 'public-key'
            }
        ],
        authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: 'discouraged',
        },
        timeout: 60000,
    }

    await db.set(['challenges', options.challenge], {
        ...options.user,
        id
    }, {
        expireIn: 60000
    })
    db.close()
    return new Response(JSON.stringify(options), {
        headers: { "Content-Type": "application/json" }
    })
})