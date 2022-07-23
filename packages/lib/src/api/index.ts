export interface Status {
    status: 'online' | 'downgraded'
}

export interface ConsolePlugin {
    id: string
    file: string
}

// TODO: heartbeat
export interface WsEvents {
    'internal/plugin-add': ConsolePlugin
    'internal/plugin-remove': { id: string }
    'internal/stop': { reason: string }
    'internal/message-reply': any
}

export namespace WsEvents {
    export type Events = keyof WsEvents
}

export * from './http'
export * from './ws'