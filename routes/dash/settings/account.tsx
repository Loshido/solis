import { define } from "utils";
import { LucideChevronLeft } from "lucide-preact"
import Button from "components/button.tsx";
import Account from "islands/settings/account.tsx";

export default define.page(() => {
    return <>
        {/* Navigation bar */}
        <header class="p-4 flex flex-row items-center justify-center relative">
            <nav class="absolute top-0 left-4 flex flex-row items-center h-full gap-1 *:transition-colors">
                <Button href="/dash/settings">
                    <LucideChevronLeft/>
                </Button>
            </nav>
            <a class="font-bold text-2xl select-none">
                Account
            </a>
        </header>

        {/* Actions */}
        <Account/>
    </>
})