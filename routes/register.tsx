import { define } from "utils";
import { page } from "fresh";

import parseCookies from "services/cookie.ts";
import { verify } from "services/jwt.ts";
export const handler = define.handlers({
    async GET(ctx) {
        const cookieHeader = ctx.req.headers.get('cookie')
        if(!cookieHeader) return page()

        const cookies = parseCookies(cookieHeader)
        if(!Object.hasOwn(cookies, 'solis')) {
            return page()
        }

        const solis = cookies['solis']
        const verified = await verify(solis)
        if(!verified) return page()

        ctx.state.payload = verified
        return ctx.redirect('/dash')
    }
})

import { LucideInfo } from "lucide-preact"
import Button from "components/button.tsx";
import Register from "islands/auth/register.tsx";
import Pwa from "islands/auth/pwa.tsx";
export default define.page(() => {
    return <>
        {/* Navigation bar */}
        <header class="p-4 flex flex-row items-center justify-center relative">
            <div class="absolute top-0 left-4 flex flex-row items-center h-full gap-1 *:transition-colors">
                <Pwa/>
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
            <Register/>
            <a href="/" class="text-black/50 hover:text-solis transition-colors cursor-pointer select-none">
                Have an account? Sign in
            </a>
        </main>
    </>
})