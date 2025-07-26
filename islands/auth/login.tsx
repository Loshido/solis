import { LucideFingerprint } from "lucide-preact";

export default function Login() {
    return <div class="relative shine px-5 py-3.5 bg-solis text-xl font-semibold text-white rounded-xl
        flex flex-row gap-2 items-center
        cursor-pointer select-none hover:bg-solis/90 transition-colors">
        <LucideFingerprint/>
        Sign in with Passkey
    </div>
}