import { define } from "utils";
import parseCookies from "services/cookie.ts";
import { verify } from "services/jwt.ts";

export default define.middleware(async (ctx) => {
    const cookieHeader = ctx.req.headers.get('cookie')
    if(!cookieHeader) return ctx.redirect('/')

    const cookies = parseCookies(cookieHeader)
    if(!Object.hasOwn(cookies, 'solis')) {
        return ctx.redirect('/')
    }

    const solis = cookies['solis']
    const verified = await verify(solis)
    if(!verified) return ctx.redirect('/')

    ctx.state.payload = verified

    return ctx.next()
})