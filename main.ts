import { App, staticFiles } from "fresh";
import type { State } from "utils";

export const app = new App<State>();

app.use(staticFiles());
app.fsRoutes();