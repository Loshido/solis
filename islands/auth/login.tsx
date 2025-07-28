import { LucideFingerprint } from "lucide-preact";
import { isCompatible } from "./lib.ts";
import { useSignal } from "@preact/signals";
import { decodeBase64Url } from "@std/encoding/base64url";
import { useSignalRef } from "@preact/signals/utils"

async function login(username: string): Promise<string | void> {
    if(!(await isCompatible())) throw new Error('your device is not compatible with passkey services')
    
    // Request credential's options
    const origin = location.origin
    const began = await fetch(origin + `/auth/login/begin?username=${username}`,)
    if(!began.ok) {
        console.error(`/auth/login/begin failed (${began.status})`)
        return await began.text()
    } 
    
    const { options, id } = await began.json()
    options.challenge = decodeBase64Url(options.challenge)
    options.allowCredentials = options.allowCredentials.map(
        (c: { id: string, type: 'public-key' }) => ({
            id: decodeBase64Url(c.id),
            type: c.type
        })
    )

    // Prompt user to validate credential
    const credential = await navigator.credentials.get({
        publicKey: options
    }) as PublicKeyCredential | null
    
    if(!credential) {
        console.error(`failed to create credentials!`)
        return
    }

    // Give payload back to serveur for verification
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
        return await completed.text()
    }

    // Go to dashboard
    location.assign(location.origin + '/dash')

    console.log('logged as', username)
}

export default () => {
    const input = useSignalRef<HTMLInputElement | null>(null)
    const username = useSignal('')
    const error = useSignal('')
    return <section class="grid grid-rows-2 gap-2 items-center relative">
        <input ref={input} placeholder="username" value={username} onInput={event => {
                username.value = event.currentTarget.value
                if(error.value.length > 0 && username.value.length >= 6) error.value = ''
            }} autoComplete="username"
            onKeyPress={async (event) => {
                if(event.key === 'Enter' && username.value.length >= 6 && input.value) {
                    input.value.disabled = true
                    const issue = await login(username.value)
                    input.value.disabled = false

                    if(issue) error.value = issue
                    else event.currentTarget.value = ''
                }
            }}
            class="px-5 py-3.5 bg-solis/25 text-xl font-semibold text-solis rounded-xl
            flex flex-row gap-2 items-center w-fit outline-none text-center
            hover:bg-solis/30 transition-colors"/>
        <div class="px-5 py-3.5 bg-solis text-xl font-semibold text-white rounded-xl
            flex flex-row gap-2 items-center
            cursor-pointer select-none hover:bg-solis/90 transition-colors"
            onClick={async () => {
                if(username.value.length < 6) {
                    error.value = 'You must provide a valid username!'
                    return
                }
                if(!input.value) return

                input.value.disabled = true
                const issue = await login(username.value)
                input.value.disabled = false
                
                if(issue) error.value = issue
                else input.value.value = ''
            }}>
            <LucideFingerprint/>
            Sign in with Passkey
        </div>
        {
            error.value.length > 0 && <p class="error text-center transition-colors select-none text-red-500
                absolute -bottom-8 left-0 w-full">
                { error.value }
            </p>
        }
    </section>
}