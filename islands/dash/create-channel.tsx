import { LucidePlug } from "lucide-preact"
import { useSignal } from "@preact/signals";

import Button from "components/button.tsx";
import type { Channel } from "services/kv.ts"

export default () => {
    const context = useSignal<null | Omit<Channel, 'owner'>>(null)
    const id = useSignal<string>('TAC-6')

    return <>
        <Button onClick={() => {
            context.value = {
                id: '',
                description: ''
            }
        }}>
            <LucidePlug class="rotate-45"/>
        </Button>
        {
            context.value !== null && <dialog open
                class="fixed no-scroll top-0 left-0 w-dvw h-dvh bg-white/25 backdrop-blur-sm blurrish"
                onClick={(event) => {
                    if(event.currentTarget === event.target) context.value = null
                }}>
                <section class="slide-in z-50 absolute bottom-0 left-0 rounded-t-4xl 
                    w-full mt-auto h-4/5 border border-solis/25 bg-white px-6 py-4
                    flex flex-col gap-4 pb-10">
                    <div class="text-lg sm:text-3xl font-medium leading-8 sm:leading-12 select-none">
                        <p>
                            Etablish a channel called 
                        </p>
                        <p class="px-2 py-1 bg-solis/10 rounded-lg outline-none"
                            contentEditable onInput={(event) => {
                                id.value = (event.target as HTMLParagraphElement).innerText
                                context.value!.id = (event.target as HTMLParagraphElement).innerText
                            }}>
                            TAC-6
                        </p> 
                        <p>
                            which could be descripted as 
                        </p>
                        <p class="px-3 py-1.5 bg-solis/10 rounded-lg outline-none text-sm"
                            contentEditable
                            onInput={(event) => {
                                context.value!.description = (event.target as HTMLParagraphElement).innerText
                            }}>
                            priority channel for realtime situational directives
                        </p>

                    </div>
                    <div class="grid grid-cols-5 p-4 gap-4 items-center">
                        <div class="col-span-2">
                            <div id="channel-card" class="aspect-square bg-solis/5 rounded-xl 
                                group-hover:bg-solis/15 transition-colors 
                                flex items-center justify-center">
                                <img src="#" alt="" class="w-full h-full p-8 rounded hidden aspect-auto object-cover" />
                            </div>
                            <p class="mt-2 font-medium select-none">
                                { id }
                            </p>
                        </div>
                        <div class="col-span-3 flex flex-col gap-4 justify-evenly pb-8">
                            <label for="bg" class="flex flex-row gap-2 items-center px-2 py-1.5 rounded 
                                bg-black/5 hover:bg-black/15 transition-colors cursor-pointer select-none">
                                <input id="bg" type="color" 
                                    onInput={(event) => {
                                        const card = document.getElementById('channel-card')
                                        const target = event.target as HTMLInputElement
                                        context.value!.color = target.value as `#${string}`

                                        if(card) card.style.backgroundColor = context.value!.color
                                    }}
                                    class="border-0 w-7 h-8 outline-none appearance-none"/>
                                <p>
                                    Pick a color
                                </p>
                            </label>
                            <label for="img" class="px-2 py-1.5 rounded select-none cursor-pointer 
                                bg-black/5 hover:bg-black/15 transition-colors">
                                Pick an image
                                <input type="file" id="img" class="invisible w-0" accept="image/png"
                                    onInput={(event) => {
                                        const target = event.target as HTMLInputElement
                                        const img = document.querySelector('#channel-card > img') as HTMLImageElement | null
                                        const file = target.files && target.files.length === 1 ? target.files.item(0) : null
                                        if(file && img) {
                                            const encoded = URL.createObjectURL(file)
                                            img.src = encoded
                                            img.style.display = 'block'
                                        }
                                    }} />
                            </label>
                        </div>
                    </div>
                    <button type="button" 
                        class="absolute bottom-4 left-6 w-full px-6 py-4 bg-solis/25 rounded-lg font-bold text-2xl
                        hover:bg-solis/40 transition-colors cursor-pointer"  
                        style={{ width: 'calc(100% - 48px)' }}
                        onClick={async () => {
                            const img = document.querySelector('#img') as HTMLInputElement | null
                            if(!img) {
                                return
                                // TODO handle UX
                            }

                            const file = img.files && img.files.length === 1 ? img.files.item(0) : null
                            if(!context.value || 
                                context.value.id.length <= 4 ||
                                context.value.description.length === 0 || 
                                !file) {
                                return
                                // TODO handle UX
                            }


                            const form = new FormData()

                            form.set('image', file)
                            form.set('id', context.value.id)
                            form.set('description', context.value.description)
                            if(context.value.color) form.set('color', context.value.color)
                            const response = await fetch('/api/channels', {
                                method: 'POST',
                                body: form,
                                credentials: 'same-origin'
                            })

                            if(!response.ok) {
                                // TODO handle UX
                            } else {
                                context.value = null
                                location.reload()
                            } 
                        }}>
                        Etablish
                    </button>
                </section>
            </dialog>
        }
    </>
}