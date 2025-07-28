interface ConfirmationProps {
    prompt: string,
    yes?: {
        label?: string,
        color?: string,
        action?: () => Promise<void> | void
    },
    no?: {
        label?: string,
        color?: string,
        action?: () => Promise<void> | void
    },
    blur?: string
}

export default ({ prompt, yes, no, ...props }: ConfirmationProps) => {
    return <dialog open class={`blurrish absolute top-0 left-0 w-dvw h-dvh bg-white/5 ${ props.blur || 'backdrop-blur-sm' }
        flex flex-col gap-4 items-center justify-center cursor-default`}
        onClick={(event) => {
            if(event.currentTarget === event.target && no?.action) no.action()
        }}>
        <h2 class="appear text-xl font-medium text-center max-w-4/5">
            { prompt }
        </h2>

        <div class="appear flex flex-row items-center gap-4">
            <button type="button" onClick={yes?.action}
                class={`px-4 py-1.5 font-medium text-lg rounded-lg cursor-pointer transition-colors ${ 
                    yes?.color  || 'bg-black/5 hover:bg-black/10' }`}>
                { yes?.label ? yes.label : 'yes' }
            </button>
            <button type="button" onClick={no?.action}
                class={`px-4 py-1.5 font-medium text-lg rounded-lg cursor-pointer transition-colors ${ 
                    no?.color  || 'bg-black/5 hover:bg-black/10' }`}>
                { no?.label ? no.label : 'no' }
            </button>
        </div>
    </dialog>
}