import { LucidePlug, LucideX } from "lucide-preact"
import Button from "../button.tsx";

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
        <Button onClick={onAccept}>
            <LucidePlug class="rotate-45"/>
        </Button>
        <Button onClick={onDeny} className="hover:bg-red-600/10 *:group-hover:stroke-red-600">
            <LucideX class="group-hover:stroke-red-600"/>
        </Button>
    </div>
</div>