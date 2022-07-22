import { Context, Service, Plugin } from 'cordis'
import { Page } from '../lib'

declare module 'cordis' {
  interface Context {
    console: Console
  }
  interface Events {
    'console/page-add'(page: Page): void
    'console/page-remove'(page: Page): void
    'console/page-update'(pages: Page[]): void
    'console/snack'(message: string): void
  }
}

export class Console extends Service {
  _pages: [Context, Page][] = []

  constructor(ctx: Context) {
    super(ctx, 'console')
  }

  get pages() {
    return this._pages.map(page => page[1])
  }

  page(page: Page): () => boolean {
    this.ctx.emit('console/page-add', page)
    const dispose = this.caller.lifecycle.register('page', this._pages, page)
    this.ctx.emit('console/page-update', this.pages)
    return () => {
      this.ctx.emit('console/page-remove', page)
      const result = dispose()
      this.ctx.emit('console/page-update', this.pages)
      return result
    }
  }

  snack(message: string) {
    this.ctx.emit('console/snack', message)
  }
}

export const name = 'internal'

export function apply(ctx: Context) {
  ctx.console = new Console(ctx)
}