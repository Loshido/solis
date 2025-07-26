import { LucidePlug, LucideX } from "lucide-preact"

interface InvitationProps {
    name: string,
    onAccept: () => Promise<void>,
    onDeny: () => Promise<void>
}

export default ({ name, onAccept, onDeny }: InvitationProps) => <div 
    class="flex flex-row items-center justify-between px-6">
    <p>
        { name }
    </p>
    <div class="flex flex-row items-center justify-between gap-1">
        <a class="rounded-full hover:bg-solis/10 group cursor-pointer" onClick={onAccept}>
            <LucidePlug class="w-10 h-10 p-2.5 rotate-45 group-hover:stroke-solis"/>
        </a>
        <a class="rounded-full hover:bg-red-600/10 group cursor-pointer" onClick={onDeny}>
            <LucideX class="w-10 h-10 p-2.5 group-hover:stroke-red-600"/>
        </a>
    </div>
</div>