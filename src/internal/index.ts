import { Context, Service, Plugin } from 'cordis'
import { Page } from '../lib'

declare module 'cordis' {
  interface Context {
    console: Console
  }
  interface Events<C extends Context = Context> {
    'console/page-add'(page: Page): void
    'console/page-remove'(page: Page): void
    'console/page-update'(pages: Page[]): void
  }
}

export class Console {
  static readonly methods = ['page']
  _pages: [Context, Page][] = []

  constructor(private ctx: Context) {}

  protected get caller() {
    return this[Context.current]
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
}

export const name = 'internal'

export function apply(ctx: Context) {
  Context.service('console', Console)
  ctx.console = new Console(ctx)
}