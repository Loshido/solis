import { define } from "utils";

export const handler = define.handlers(() => {
    return new Response(null, {
        status: 200,
        headers: {
            'Set-Cookie': 'solis=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
    })
})