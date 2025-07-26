import { LucideFingerprint } from "lucide-preact"

export default function Register() {
    return <section class="grid grid-rows-2 gap-2 items-center">
        <input placeholder="username" 
            class="px-5 py-3.5 bg-solis/25 text-xl font-semibold text-solis rounded-xl
            flex flex-row gap-2 items-center w-fit outline-none text-center
            cursor-pointer select-none hover:bg-solis/30 transition-colors"/>
        <div class="px-5 py-3.5 bg-solis text-xl font-semibold text-white rounded-xl
            flex flex-row gap-2 items-center
            cursor-pointer select-none hover:bg-solis/90 transition-colors">
            <LucideFingerprint/>
            Sign up with Passkey
        </div>
        {/* <p>
            Error message
        </p> */}
    </section>
}