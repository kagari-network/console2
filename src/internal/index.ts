import { Context, Service } from 'cordis'
import { ConsolePlugin } from '../lib'

declare module 'cordis' {
  interface Context {
    console: Console
  }
  interface Events {
    'console/plugin-add'(plugin: ConsolePlugin): void
    'console/plugin-remove'(plugin: ConsolePlugin): void
    'console/plugin-update'(plugins: ConsolePlugin[]): void
  }
}

export class Console extends Service {
  plugins: ConsolePlugin[] = []

  plugin(plugin: ConsolePlugin): () => void {
    this.ctx.emit('console/plugin-add', plugin)
    this.plugins.push(plugin)
    this.ctx.emit('console/plugin-update', this.plugins)
    return () => {
      const index = this.plugins.indexOf(plugin)
      if (index === -1) return
      this.ctx.emit('console/plugin-remove', plugin)
      this.plugins.splice(index, 1)
      this.ctx.emit('console/plugin-update', this.plugins)
    }
  }
}

export default function (ctx: Context) {
  ctx.console = new Console(ctx, 'console')
}