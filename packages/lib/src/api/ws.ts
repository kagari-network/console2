import { Context } from 'cordis'
import { ConsolePlugin } from '../console'
import { v4 } from 'uuid'

const URL = 'ws://127.0.0.1:8080'

declare module 'cordis' {
  interface Events<C extends Context = Context> {
    'console/message'(data: WsEvent): void
  }
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

export interface WsEvent<T extends WsEvents.Events = WsEvents.Events> {
  id?: string
  type: T
  data: WsEvents[T]
}

export class WsApi {
  socket: WebSocket
  responseHook: Record<string, Function>

  constructor(private ctx: Context) { }

  start() {
    if (this.socket) return
    this.socket = new WebSocket(URL)
    this.socket.onmessage = message => {
      const data = JSON.parse(message.data)
      if (!data.type) return
      if (data.type === 'internal/message-reply') {
        this.responseHook[data.id]?.(data.data)
        return
      }
      this.ctx.emit('console/message', data)
    }
  }

  send(message: WsEvent): Promise<any> {
    const id = v4()
    message.id = id
    this.socket.send(JSON.stringify(message))
    return new Promise((resolve, reject) => {
      this.responseHook[id] = resolve
      setTimeout(() => {
        delete this.responseHook[id]
        reject(new Error('timeout'))
      }, 60000)
    })
  }
}