import { Context, Service, Fork, Plugin } from 'cordis'
import { Page } from '..'
import { HttpApi, WsApi, WsEvent } from '../api'
import { WsEvents } from '..'

declare module 'cordis' {
  interface Context {
    console: Console
  }
  interface Events {
    'console/page-add'(page: Page): void
    'console/page-remove'(page: string): void
    'console/page-update'(pages: Page[]): void
    'console/snack'(message: string): void
  }
}

export interface ConsolePlugin {
    id: string
    file: string
}

type WsEventListener<T extends WsEvents.Events> = (data: WsEvents[T]) => any
type EventListenerTruple<T extends WsEvents.Events = WsEvents.Events> = [T, WsEventListener<T>] 

export class Console extends Service {
  _pages: [Context, Page][] = []
  _wsEvents: [Context, EventListenerTruple][] = []
  ws: WsApi
  http: HttpApi

  constructor(ctx: Context) {
    super(ctx, 'console')
    this.ws = new WsApi(this.ctx)
    this.http = new HttpApi(this.ctx)
  }

  get pages() {
    return this._pages.map(page => page[1])
  }

  protected start(): void | Promise<void> {
    this.ws.start()
  }

  // TODO: disposable
  page(page: Page): () => boolean {
    this.ctx.emit('console/page-add', page)
    const dispose = this.caller.lifecycle.register('page', this._pages, page)
    this.ctx.emit('console/page-update', this.pages)
    return () => {
      this.ctx.emit('console/page-remove', page.id)
      const result = dispose()
      this.ctx.emit('console/page-update', this.pages)
      return result
    }
  }

  snack(message: string) {
    this.ctx.emit('console/snack', message)
  }

  on<T extends WsEvents.Events>(type: T, listener: WsEventListener<T>) {
    return this.caller.lifecycle.register('wsEvent', this._wsEvents, [type, listener])
  }

  send(message: WsEvent) {
    return this.ws.send(message)
  }
}

export const name = 'console'

export function apply(ctx: Context) {
  ctx.console = new Console(ctx)

  ctx.on('ready', async () => {
    const status = await ctx.console.http.getStatus()
    if (status.data.status !== 'online') {
      ctx.console.snack('服务器状态异常: ' + status.message)
      return
    }
  })

  ctx.on('console/message', data => {
    ctx.console._wsEvents
      .filter(e => e[1][0] === data.type)
      .forEach(([, [, callback]]) => {
        const result = callback(data.data)
        if (!result) return
        ctx.console.send({
          type: 'internal/message-reply',
          data: result
        })
      })
  })

  ctx.console.on('internal/stop', data => {
    ctx.console.snack('服务器已停止: ' + data.reason)
  })

  const plugins: [Context, [string, Fork]][] = []
  ctx.console.on('internal/plugin-add', async ({ id, file }) => {
    if (plugins.find(([, [pid]]) => pid === id)) return
    try {
      const plugin = await import(file) as Plugin
      const fork = ctx.plugin(plugin)
      const dispose = ctx.lifecycle.register('plugin', plugins, [id, fork])
      const forkDispose = fork.dispose
      fork.dispose = () => forkDispose() && dispose()
      return true
    } catch(e) {
      ctx.console.snack('插件加载失败: ' + String(e))
    }
    return false
  })

  ctx.console.on('internal/plugin-remove', ({ id }) => {
    const plugin = plugins.find(([, [pid]]) => pid === id)
    if (!plugin) return
    return plugin[1][1].dispose()
  })
}