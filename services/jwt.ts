import { SignJWT, jwtVerify, type JWTPayload } from "@panva/jose"

export interface Payload extends JWTPayload {
    id: string,
    username: string
}

const AUDIENCE = Deno.env.get('JWT_AUDIENCE') || 'solis-client'
const ISSUER = Deno.env.get('JWT_ISSUER') || 'loshido-solis'
const JWT_SECRET = Deno.env.get('JWT_SECRET')
if(!JWT_SECRET) throw new Error('JWT_SECRET environmnent variable is missing')

const secret = new TextEncoder().encode(JWT_SECRET)
const alg = 'HS256'

export async function sign(payload: Exclude<JWTPayload, Payload>) {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setExpirationTime('24h')
      .sign(secret)

    return jwt
}

export async function verify(jwt: string): Promise<Payload | null> {
    try {
        const { payload } = await jwtVerify<Payload>(jwt, secret, {
            issuer: ISSUER,
            audience: AUDIENCE,
        })
        return payload
    } catch {
        return null
    }
}