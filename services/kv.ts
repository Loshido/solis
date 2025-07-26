import { openKv } from "@deno/kv"

export default async () => {
    return await openKv('./data/kv.db')
}