import { createDefine } from "fresh";
import { Payload } from "services/jwt.ts";

export interface State {
    payload?: Payload
}

export const define = createDefine<State>();
