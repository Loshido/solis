#!/usr/bin/env -S deno run -A --watch=static/,routes/
import { Builder } from "fresh/dev";
import { app } from "./main.ts";
import tailwind from "services/tailwind.ts";

const builder = new Builder();
tailwind(builder)

if (Deno.args.includes("build")) {
    (await builder.build({ mode: 'development' }))(app)
} else {
    // deno-lint-ignore require-await
    await builder.listen(async () => ({ app: app }));
}
