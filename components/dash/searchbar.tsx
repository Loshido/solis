import { LucideSearch } from "lucide-preact"
const DEBOUNCE_TIME = 300

interface SearchProps {
    onUpdate: (input: string) => Promise<void> | void
}
export default function SearchBar({ onUpdate }: SearchProps) {
    return <div 
        class="px-4 py-3 bg-solis/10 rounded-lg flex flex-row items-center gap-4">
        <LucideSearch class="stroke-solis/60"/>
        <input type="text" placeholder="Search channels"
            class="text-solis/60 text-xl outline-0 w-full h-full"
            onInput={(event) => {
                const t = event.target as HTMLInputElement
                const value = t.value
                setTimeout(() => {
                    if(value === t.value) {
                        onUpdate((event.target as HTMLInputElement).value)
                    }
                }, DEBOUNCE_TIME);
            }}
            />
    </div>
} 