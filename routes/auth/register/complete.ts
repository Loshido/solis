import { decodeBase64Url } from "@std/encoding/base64url";
import { define } from "utils";
import { verifyRegistrationResponse, VerifiedRegistrationResponse } from "@simplewebauthn/server"
import { RP_ORIGIN, RP_ID, DOMAIN } from "services/env.ts";
import kv, { type Challenge } from "services/kv.ts"
import { sign } from "services/jwt.ts";
import log from "services/log.ts";

export const handler = define.handlers(async ctx => {
    // Ensure request have a body
    if(ctx.req.method !== 'POST') {
        return new Response('You must attach your credential.', {
            status: 400
        })
    }

    // Extract body
    const { user: userData, credential } = await ctx.req.json()
    if(!userData || !credential) return new Response('You must attach correct credential.', {
        status: 400
    })

    // Decode response
    const _clientDataJSON = new TextDecoder().decode(decodeBase64Url(credential.response.clientDataJSON))
    const clientDataJSON = JSON.parse(_clientDataJSON)

    const user = {
        id: new TextDecoder().decode(decodeBase64Url(userData.id)),
        username: userData.displayName,
        channels: [],
        invitations: []
    }

    const db = await kv()
    // Get the challenge we store in first phase.
    const challenge = await db.get<Challenge>(['challenges', clientDataJSON.challenge])
    if(!challenge.value || challenge.value.id !== user.id) {
        db.close()
        log('auth', `/auth/register/complete caught an unmatchted challenge`, 'DEBUG')
        return new Response('Challenges not matching!', {
            status: 400
        })
    }
    
    // Verify challenge
    let verification: VerifiedRegistrationResponse 
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
        return new Response('Verification failed.', {
            status: 400
        })
    }
    if(!verification.verified || !verification.registrationInfo) {
        db.close()
        return new Response('Verification failed.', {
            status: 400
        })
    }

    const { credential: response } = verification.registrationInfo
   
    // Store user
    await db.set(['users', user.username], user)
    // Store credentials
    await db.set(['credentials', user.username], {
        id: response.id,
        publicKey: response.publicKey,
        createdat: Date.now(),
        counter: response.counter,
        transports: response.transports
    })
    // Delete challenge
    await db.delete(['challenges', clientDataJSON.challenge])
    db.close()

    const addr = ctx.info.remoteAddr
    const net = addr.transport === 'tcp' || addr.transport === 'udp'
    const origin = net ? `${addr.hostname}` : ''

    log('auth', `/auth/register/complete challenge succeed ${ (challenge.key[1] as string).slice(0, 6) }`, 'TRACE')
    log('auth', `${user.username} (${user.id}, ${origin}) successfuly registered`, 'INFO')

    // Sign a JWT
    const jwt = await sign({
        id: user.id,
        username: user.username,

        // We can then found which authentification (date-time) gave this token
        challenge: (challenge.key[1] as string).slice(0, 6)
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