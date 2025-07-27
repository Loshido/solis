import { IS_BROWSER } from "fresh/runtime";

export async function isCompatible(): Promise<boolean> {
    if(!IS_BROWSER) throw new Error('register() is a client-side function!')
    // deno-lint-ignore no-window
    return window.PublicKeyCredential && 
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable() &&
        await PublicKeyCredential.isConditionalMediationAvailable()
}