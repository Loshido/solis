interface CardProps {
    href: string,
    name: string,
    image?: string,
    color?: `#${string}` | `rgb(${number}, ${number}, ${number})`
}

export default ({ href, name, image, color }: CardProps) => <a href={href} 
    class="group cursor-pointer appear">
    <div class="aspect-square bg-solis/5 rounded-xl 
        group-hover:bg-solis/15 transition-colors
        flex items-center justify-center"
        style={{backgroundColor: color}}>
        {
            image && <img src={image} alt={name} class="w-full h-full p-8 rounded" />
        }
    </div>
    <p class="mt-2 font-medium select-none">
        {
            name
        }
    </p>
</a>