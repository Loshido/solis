import { define } from "utils";

export const handler = define.handlers({
  GET(ctx) {
    const name = ctx.params.name;
    return new Response(
      `Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
    );
  },
});
