import { openKv } from "@deno/kv"
import { KV_PATH } from "./env.ts";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/server"

export default async () => {
    return await openKv(KV_PATH)
}

// challenges/[challenge] -> Challenge
export type Challenge = {
    id: string,
    name: string,
    displayName: string
}

// credentials/[user.id] -> Credential
export interface Credential {
    id: string,
    publicKey: Uint8Array,
    createdat: number,
    counter: number,
    transports: AuthenticatorTransportFuture[]
}

// users/[user.id] -> User
export interface User {
    id: string,
    username: string,
    channels: string[]
}

//channels/[channel.id] -> Channel
export interface Channel {
    id: string,
    secret: string,
    owner: string,
    image?: string,
    color?: `#${string}` | 
        `rgb(${number}, ${number}, ${number})`
}