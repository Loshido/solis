import { decodeBase64Url } from "@std/encoding/base64url";
import { define } from "utils";
import { verifyRegistrationResponse } from "@simplewebauthn/server"
import { RP_ORIGIN, RP_ID, DOMAIN } from "services/env.ts";
import kv, { type Challenge } from "services/kv.ts"
import { sign } from "services/jwt.ts";

export const handler = define.handlers(async ctx => {
    // Ensure request have a body
    if(ctx.req.method !== 'POST') {
        return new Response('You must attach your credentials', {
            status: 400
        })
    }

    // Extract body
    const { user: userData, credential } = await ctx.req.json()
    if(!userData || !credential) return new Response('You must attach correct credentials', {
        status: 400
    })

    // Decode response
    const _clientDataJSON = new TextDecoder().decode(decodeBase64Url(credential.response.clientDataJSON))
    const clientDataJSON = JSON.parse(_clientDataJSON)

    const user = {
        id: new TextDecoder().decode(decodeBase64Url(userData.id)),
        username: userData.displayName,
        channels: []
    }

    const db = await kv()
    // Get the challenge we store in first phase.
    const challenge = await db.get<Challenge>(['challenges', clientDataJSON.challenge])
    if(!challenge.value || challenge.value.id !== user.id) {
        db.close()
        return new Response('Stored challenge not matching', {
            status: 400
        })
    }
    
    // Verify challenge
    let verification
    try {
        verification = await verifyRegistrationResponse({
            response: credential,
            expectedChallenge: challenge.key[1] as string,
            expectedOrigin: RP_ORIGIN,
            expectedRPID: RP_ID
        })
    } catch(error) {
        console.error(error)
        db.close()
        return new Response('Verification failed', {
            status: 400
        })
    }
    if(!verification.verified) {
        db.close()
        return new Response('Verification failed', {
            status: 400
        })
    }
   
    // Store user
    await db.set(['users', user.id], user)
    // Store credentials
    await db.set(['credentials', user.id], {
        id: credential.id,
        publicKey: credential.response.publicKey,
        createdat: Date.now(),
        counter: 0,
        transports: credential.response.transports
    })
    // Delete challenge
    await db.delete(['challenges', clientDataJSON.challenge])
    db.close()

    // Sign a JWT
    const jwt = await sign({
        id: user.id,
        username: user.username
    })

    // Give JWT to the end user
    return new Response('ok', {
        status: 200,
        headers: {
            'Content-Type': 'plain/text',
            'Set-Cookie': [
                `solis=${jwt}`,
                `Domain=${DOMAIN}`,
                `Expires=` + new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString(),
                `Path=/`,
                `SameSite=Strict`
            ].join('; ')
        }
    })
})