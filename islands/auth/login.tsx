import { LucideFingerprint } from "lucide-preact";
import { isCompatible } from "./lib.ts";
import { useSignal } from "@preact/signals";
import { decodeBase64Url } from "@std/encoding/base64url";

async function login(username: string) {
    if(!(await isCompatible())) throw new Error('your device is not compatible with passkey services')
    
    const origin = location.origin
    const began = await fetch(origin + `/auth/login/begin?username=${username}`,)
    if(!began.ok) {
        console.error(`/auth/login/begin failed (${began.status})`)
        return
    } 
    
    const { options, id } = await began.json()
    options.challenge = decodeBase64Url(options.challenge)
    options.allowCredentials = options.allowCredentials.map(
        (c: { id: string, type: 'public-key' }) => ({
            id: decodeBase64Url(c.id),
            type: c.type
        })
    )
    const credential = await navigator.credentials.get({
        publicKey: options
    }) as PublicKeyCredential | null
    
    if(!credential) {
        console.error(`failed to create credentials!`)
        return
    }
    const completed = await fetch(origin + '/auth/login/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
            credential,
            user: {
                username,
                id
            }
        })
    })

    if(!completed.ok) {
        console.error(`/auth/login/completed failed (${completed.status})`)
        console.error(await completed.text())
        return
    }

    location.assign(location.origin + '/dash')

    console.log('logged as', username)
}

export default () => {
    const username = useSignal('')
    const error = useSignal(false)
    return <section class="grid grid-rows-2 gap-2 items-center relative">
        <input placeholder="username" value={username} onInput={event => {
                username.value = event.currentTarget.value
                if(error.value && username.value.length >= 6) error.value = false
            }}
            onKeyPress={(event) => {
                if(event.key === 'Enter' && username.value.length >= 6) {
                    login(username.value)
                }
            }}
            class="px-5 py-3.5 bg-solis/25 text-xl font-semibold text-solis rounded-xl
            flex flex-row gap-2 items-center w-fit outline-none text-center
            cursor-pointer select-none hover:bg-solis/30 transition-colors"/>
        <div class="px-5 py-3.5 bg-solis text-xl font-semibold text-white rounded-xl
            flex flex-row gap-2 items-center
            cursor-pointer select-none hover:bg-solis/90 transition-colors"
            onClick={() => {
                if(username.value.length < 6) {
                    error.value = true
                    return
                }
                login(username.value)
            }}>
            <LucideFingerprint/>
            Sign in with Passkey
        </div>
        {
            error.value && <p class="error text-center transition-colors select-none text-red-500
                absolute -bottom-8 left-0 w-full">
                You must provide a valid username!
            </p>
        }
    </section>
}