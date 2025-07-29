import { LOG_PATH } from "./env.ts"

type LogLevel = 'DEBUG'| 'TRACE'| 'INFO'| 'WARNING'| 'ERROR'| 'CRITICAL'
const levels = ['DEBUG', 'TRACE', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']

export default (service: string, message: string, level?: LogLevel) => {
    const envLevel = Deno.env.get('LOG_LEVEL') || 'INFO'
    if(levels.indexOf(level || 'INFO') < levels.indexOf(envLevel)) return

    const date = new Date()
    const datetime = new Intl.DateTimeFormat('sv-SE', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(date)

    Deno.writeTextFile(
        LOG_PATH + service + '.log', 
        datetime + ` [${level || 'INFO'}] ${message}\n`,
        { append: true }
    )
}