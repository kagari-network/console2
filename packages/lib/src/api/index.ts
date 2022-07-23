export interface Status {
    status: 'online' | 'downgraded'
}

export interface Plugin {
    id: string
    name: string
    file: string
}

// TODO: heartbeat
export interface WsEvents {
    'internal/plugin': Plugin
    'internal/stop': void
    'internal/message-reply': any
}

export * as http from './http'
export * as ws from './ws'