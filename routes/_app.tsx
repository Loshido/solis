import type { PageProps } from "fresh";

export default function App({ Component }: PageProps) {
  return <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Solis</title>
            <link rel="icon" href="/fav.png" type="image/png" />
            <link rel="stylesheet" href="/styles.css" />
            <link rel="manifest" href="/solis.webmanifest"></link>
        </head>
        <body>
            <Component />
        </body>
    </html>
}
