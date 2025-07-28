import { verify, type Payload } from "./jwt.ts";

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cookie
export const parseCookies = (cookies: string): { [key: string]: string } => {
    const map: { [key: string]: string } = {}
    
    const list = cookies.split('; ').map(cookie => cookie.split('=').slice(0, 2)) as [string, string][]
    list.forEach(pair => map[pair[0]] = pair[1])
    return map
}

export default async (req: Request): Promise<Payload | null> => {
    const cookieHeader = req.headers.get('cookie')
    if(!cookieHeader) return null

    const cookies = parseCookies(cookieHeader)
    if(!Object.hasOwn(cookies, 'solis')) {
        return null
    }

    const solis = cookies['solis']
    return await verify(solis)
}