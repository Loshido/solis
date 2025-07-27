export default (cookies: string): { [key: string]: string } => {
    const map: { [key: string]: string } = {}
    
    const list = cookies.split('; ').map(cookie => cookie.split('=').slice(0, 2)) as [string, string][]
    list.forEach(pair => map[pair[0]] = pair[1])
    return map
}