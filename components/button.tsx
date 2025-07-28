import type { JSX } from "preact"

interface ButtonProps {
    children: JSX.Element,
    className?: string
    href?: string,
    onClick?: () => Promise<void> | void
}

export default ({ children, className, href, onClick }: ButtonProps) => <a 
    href={href} onClick={onClick}
    class={`rounded-full group cursor-pointer *:w-10 *:h-10 *:p-2.5 transition-colors
    ${ className ? className : 'hover:bg-solis/10 *:group-hover:stroke-solis'}`}>
    { children }
</a>