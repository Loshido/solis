import { define } from "utils";
import { page } from "fresh";

import isAuthentificated from "services/cookie.ts";
export const handler = define.handlers({
    // If connected, gets redirected to /dash
    async GET(ctx) {
        const verified = await isAuthentificated(ctx.req)
        if(!verified) return page()
            
        ctx.state.payload = verified
        return ctx.redirect('/dash')
    }
})

import { LucideInfo } from "lucide-preact"
import Button from "components/button.tsx";
import Login from "islands/auth/login.tsx";
import PwaButton from "islands/pwa.tsx";
export default define.page(() => {
    return <>
        {/* Navigation bar */}
        <header class="p-4 flex flex-row items-center justify-center relative">
            <div class="absolute top-0 left-4 flex flex-row items-center h-full gap-1 *:transition-colors">
                <PwaButton/>
                <Button>
                    <LucideInfo/>
                </Button>
            </div>
            <a href="/" class="font-bold text-2xl select-none cursor-pointer hover:text-solis">
                Solis
            </a>
        </header>
        <main class="no-scroll h-full flex flex-col items-center justify-between p-8">
            <span/>
            <Login/>
            <a href="/register" class="text-black/50 hover:text-solis transition-colors cursor-pointer select-none">
                Don't have an account? Sign up
            </a>
        </main>
    </>
})