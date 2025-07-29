import { decodeBase64Url } from "@std/encoding/base64url";
import { define } from "utils";
import kv, { type Challenge, type Credential } from "services/kv.ts";
import { VerifiedAuthenticationResponse, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { DOMAIN, RP_ID, RP_ORIGIN } from "services/env.ts";
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
    const { user, credential } = await ctx.req.json()
    if(!user || !credential) return new Response('You must attach correct credential.', {
        status: 400
    })

    // Decode response
    const _clientDataJSON = new TextDecoder().decode(decodeBase64Url(credential.response.clientDataJSON))
    const clientDataJSON = JSON.parse(_clientDataJSON)

    const db = await kv()
    // Get the challenge back
    const challenge = await db.get<Challenge>(['challenges', clientDataJSON.challenge])
    if(!challenge.value || challenge.value.id !== user.id) {
        db.close()
        log('auth', `/auth/login/complete caught an unmatchted challenge`, 'DEBUG')
        return new Response('Challenges not matching!', {
            status: 400
        })
    }

    user.id = new TextDecoder().decode(decodeBase64Url(user.id))
    const storedCredential = await db.get<Credential>(['credentials', user.username])
    if(!storedCredential || !storedCredential.value || storedCredential.value.id !== credential.id) {
        db.close()
        return new Response('Wrong credential.', {
            status: 400
        })
    }
    // Verify challenge
    let verification: VerifiedAuthenticationResponse
    try {
        verification = await verifyAuthenticationResponse({
            response: credential,
            expectedChallenge: challenge.key[1] as string,
            expectedOrigin: RP_ORIGIN,
            expectedRPID: RP_ID,
            credential: {
                id: credential.id,
                publicKey: storedCredential.value.publicKey,
                counter: storedCredential.value.counter,
                transports: storedCredential.value.transports
            },
            requireUserVerification:  false
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

    // Store credentials
    await db.set(['credentials', user.username], {
        ...storedCredential.value,
        counter: verification.authenticationInfo.newCounter
    })
    // Delete challenge
    await db.delete(['challenges', clientDataJSON.challenge])
    db.close()

    const addr = ctx.info.remoteAddr
    const net = addr.transport === 'tcp' || addr.transport === 'udp'
    const origin = net ? `${addr.hostname}` : ''

    log('auth', `/auth/login/complete challenge succeed ${ (challenge.key[1] as string).slice(0, 6) }`, 'TRACE')
    log('auth', `${user.username} (${user.id}, ${origin}) successfuly logged`, 'INFO')
    
    // Sign a JWT
    const jwt = await sign({
        id: user.id,
        username: user.username,
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