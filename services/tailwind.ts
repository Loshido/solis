import postcss from "npm:postcss@8.5.6";
import twPostCss from "npm:@tailwindcss/postcss";
import type { Builder } from "fresh/dev";

export default (builder: Builder) => {
    const instance = postcss(twPostCss({
        optimize: builder.config.mode === "production",
    }));
    
    builder.onTransformStaticFile({ pluginName: "tailwind", filter: /\.css$/ }, async (args) => {
        const res = await instance.process(args.text, {
            from: args.path,
        });
        return {
            content: res.content,
            map: res.map?.toString(),
        };
    });
}