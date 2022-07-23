import { Context } from 'cordis'
import { WsEvents } from '.'
import { v4 } from 'uuid'

const URL = 'ws://127.0.0.1'

declare module 'cordis' {
    interface Events<C extends Context = Context> {
        'console/message'<T extends WsEvents[keyof WsEvents]>(data: T): void
    }
}

export interface WsEvent<T extends keyof WsEvents> {
    id?: string
    type: T
    data: WsEvents[T]
}

export class WsApi {
    socket: WebSocket
    responseHook: Record<string, [Function, Function]>
    constructor(ctx: Context) {
        this.socket = new WebSocket(URL)
        this.socket.onmessage = message => {
            const data = JSON.parse(message.data)
            if (!data.type) return
            if (data.type === 'internal/message-reply') {
                const [resolve] = this.responseHook[data.id]
                resolve(data.data)
                return
            }
            ctx.emit('console/message', data)
        }
    }

    send<T extends keyof WsEvents, U extends keyof WsEvents>(message: WsEvent<T>): Promise<WsEvent<U>> {
        const id = v4()
        message.id = id
        this.socket.send(JSON.stringify(message))
        return new Promise((resolve, reject) => {
            this.responseHook[id] = [resolve, reject]
            setTimeout(() => {
                delete this.responseHook[id]
                reject(new Error('timeout'))
            }, 60000)
        })
    }
}