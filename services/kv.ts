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

// credentials/[username] -> Credential
export interface Credential {
    id: string,
    publicKey: Uint8Array,
    createdat: number,
    counter: number,
    transports: AuthenticatorTransportFuture[]
}

// users/[username] -> User
export interface User {
    id: string,
    username: string,
    channels: string[],
    invitations: string[]
}

//channels/[channel.id] -> Channel
export interface Channel {
    id: string,
    owner: string, // username
    description: string,
    image?: string,
    color?: `#${string}` | 
        `rgb(${number}, ${number}, ${number})`
}