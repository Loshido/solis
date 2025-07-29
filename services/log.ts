import { LOG_PATH, LOG_MODE } from "./env.ts"

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

    if(LOG_MODE === 'file') {
        Deno.writeTextFile(
            LOG_PATH + service + '.log', 
            datetime + ` [${level || 'INFO'}] ${message}\n`,
            { append: true }
        )
    } else if (LOG_MODE === 'console') {
        const msg = datetime + ` ${message}`
        switch(level) {
            case 'DEBUG':
                console.debug(msg)
                break;
            case 'TRACE':
                console.trace(msg)
                break;
            case 'INFO':
                console.info(msg)
                break;
            case 'WARNING':
            case 'CRITICAL':
                console.warn(msg)
                break;
            case 'ERROR':
                console.error(msg)
        }
    }
}