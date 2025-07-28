import { JSX } from "preact";
import Slide from "../slide.tsx";

interface Props {
    children: JSX.Element | JSX.Element[]
}

export default ({ children }: Props) => {
    return <Slide onSlideLeft={() => {
        location.assign('/dash')
    }}>
        { children }
    </Slide>
}