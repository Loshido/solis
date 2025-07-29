export const RP_NAME = Deno.env.get('RP_NAME') || 'Solis'
export const RP_ID = Deno.env.get('RP_ID') ||'localhost'
export const RP_ORIGIN = Deno.env.get('RP_ORIGIN') || 'http://localhost:8000'
export const DOMAIN = Deno.env.get('DOMAIN') || 'localhost'
export const LOG_MODE = Deno.env.get('LOG_MODE') || 'file' // 'file' | 'console'

export const KV_PATH = Deno.env.get('KV_PATH') === 'disabled' 
    ? undefined 
    : Deno.env.get('KV_PATH') || './data/kv.db'
export const LOG_PATH = Deno.env.get('LOG_PATH') || './data/logs/'
export const BUCKET_PATH = Deno.env.get('BUCKET_PATH') || './static/bucket/'
export const CHANNELS_PATH = Deno.env.get('CHANNELS_PATH') || './data/channels/'

// JWT
export const JWT_AUDIENCE = Deno.env.get('JWT_AUDIENCE') || 'solis-client'
export const JWT_ISSUER = Deno.env.get('JWT_ISSUER') || 'loshido-solis'
// JWT_SECRET -> .env