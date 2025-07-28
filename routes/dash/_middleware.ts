import { define } from "utils";
import isAuthentificated from "services/cookie.ts";

export default define.middleware(async (ctx) => {
    // If not connected, gets redirected to /
    const verified = await isAuthentificated(ctx.req)
    if(!verified) return ctx.redirect('/')
    ctx.state.payload = verified

    return ctx.next()
})