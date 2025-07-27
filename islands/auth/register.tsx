import { LucideFingerprint } from "lucide-preact"
import { useSignal } from "@preact/signals";
import { isCompatible } from "./lib.ts";
import { decodeBase64Url, encodeBase64Url } from "@std/encoding/base64url";

async function register(username: string): Promise<string | void> {
    if(!(await isCompatible())) throw new Error('your device is not compatible with passkey services')
    
    // fetch credential options
    const origin = location.origin
    const began = await fetch(origin + `/auth/register/begin?username=${username}`,)
    if(!began.ok) {
        console.error(`/auth/register/begin failed (${began.status})`)
        return await began.text()
    } 

    // .into
    const options = await began.json()
    options.challenge = decodeBase64Url(options.challenge)
    options.user.id = decodeBase64Url(options.user.id)
    const credential = await navigator.credentials.create({
        publicKey: options
    }) as PublicKeyCredential | null

    if(!credential) {
        console.error(`failed to create credentials!`)
        return "Failed to create credentials!"
    }

    options.user.id = encodeBase64Url(options.user.id)

    // Send passkey public details
    const completed = await fetch(origin + '/auth/register/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ 
            credential: credential.toJSON(), 
            user: options.user,
        })
    })

    if(!completed.ok) {
        console.error(`/auth/register/completed failed (${completed.status})`)
        console.error(await completed.text())
        return await completed.text()
    }

    // Go to dashboard
    location.assign(location.origin + '/dash')

    console.log('registered as', username)
}

export default () => {
    const username = useSignal('')
    const error = useSignal('')

    return <section class="grid grid-rows-2 gap-2 items-center relative">
        <input placeholder="username" value={username} onInput={event => {
                username.value = event.currentTarget.value
                if(error.value.length > 0 && username.value.length >= 6) error.value = ''
            }}
            onKeyPress={async (event) => {
                if(event.key === 'Enter' && username.value.length >= 6) {
                    const issue = await register(username.value)
                    if(issue) error.value = issue
                }
            }} autoComplete="username"
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
                const issue = await register(username.value)
                if(issue) error.value = issue
            }}>
            <LucideFingerprint/>
            Sign up with Passkey
        </div>
        {
            error.value.length > 0 && <p class="error text-center transition-colors select-none text-red-500
                absolute -bottom-8 left-0 w-full">
                { error.value }
            </p>
        }
    </section>
}