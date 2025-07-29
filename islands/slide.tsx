import { JSX } from "preact";
import { useSignal } from "@preact/signals";

const SLIDE_DISTANCE = 150

interface SlideProps {
    // At which distance is it considered as slide
    slideDistance?: number
    onSlideLeft?: () => unknown
    onSlideRight?: () => unknown
    onSlideTop?: () => unknown
    onSlideBottom?: () => unknown
    children: JSX.Element[] | JSX.Element
}

export default ({ children, slideDistance, ...events }: SlideProps) => {
    const touch = useSignal<[number, number, boolean]>([0, 0, false])
    const distance = slideDistance || SLIDE_DISTANCE

    return <div class="w-full h-full"
        onTouchStart={(event) => {
            if(event.touches.length >= 1) {
                const t = event.touches[0]
                touch.value = [ t.pageX, t.pageY, true ]
            }
        }}
        onTouchEnd={(event) => {
            if(event.changedTouches.length >= 1 && touch.value[2]) {
                const t = event.changedTouches[0]
                const dx = t.pageX - touch.value[0]
                const dy = t.pageY - touch.value[1]
                
                if(dx > distance && events.onSlideLeft) events.onSlideLeft()
                if(-dx > distance && events.onSlideRight) events.onSlideRight()
                if(dy > distance && events.onSlideTop) events.onSlideTop()
                if(-dy > distance && events.onSlideBottom) events.onSlideBottom()
            }
        }}
        onTouchCancel={() => {
            touch.value[2] = false
        }}>
        {
            children
        }
    </div>
}