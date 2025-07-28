import { encodeBase64Url } from "@std/encoding/base64url";
import { define } from "utils";
import { RP_ID } from "services/env.ts";
import kv, { type User, Credential } from "services/kv.ts";
import log from "services/log.ts";

export const handler = define.handlers(async ctx => {
    const username = ctx.url.searchParams.get('username')
    if(!username || username.length < 6) {
        return new Response(`You must provide a valid username`, {
            status: 400
        })
    }
    
    const db = await kv()

    // Check if user exists
    const { value: user } = await db.get<User>(['users', username])
    if(!user) {
        db.close()
        return new Response(`${username} doesn't exist!`, {
            status: 400
        })
    }

    // Get credential's id
    const { value: credential } = await db.get<Credential>(['credentials', user.username])
    if(!credential) {
        db.close()
        log('auth', `/auth/login/begin caught an account without credential`, 'DEBUG')
        return new Response('No credential linked to your account.', {
            status: 400
        })
    }

    const options = {
        challenge: encodeBase64Url(crypto.getRandomValues(new Uint8Array(32)).buffer),
        allowCredentials: [
            {
                id: credential.id,
                type: 'public-key'
            }
        ],
        rpId: RP_ID,
        timeout: 60000,
        userVerification: "discouraged"
    }

    const encodedId = encodeBase64Url(new TextEncoder().encode(user.id))
    await db.set(['challenges', options.challenge], {
        id: encodedId,
        name: username.toLowerCase(),
        displayName: username
    }, {
        expireIn: 60000
    })    
    db.close()

    log('auth', `/auth/login/begin challenge initiated ${ options.challenge.slice(0, 6) }`, 'TRACE')
    return new Response(JSON.stringify({ options, id: encodedId }), {
        headers: { "Content-Type": "application/json" }
    })
})