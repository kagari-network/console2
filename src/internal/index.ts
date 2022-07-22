import { Context, Service, Plugin } from 'cordis'
import { Page } from '../lib'

declare module 'cordis' {
  interface Context {
    console: Console
  }
  interface Events<C extends Context = Context> {
    'console/page-add'(page: Page<C>): void
    'console/page-remove'(page: Page<C>): void
    'console/page-update'(pages: Page<C>[]): void
  }
}

export class Console {
  static readonly methods = ['page']
  pages: [Context, Page][] = []

  constructor(private ctx: Context) {}

  protected get caller() {
    return this[Context.current]
  }

  page(page: Page): () => boolean {
    this.ctx.emit('console/page-add', page)
    const dispose = this.caller.lifecycle.register('page', this.pages, page)
    this.ctx.emit('console/page-update', this.pages.map(e => e[1]))
    return () => {
      this.ctx.emit('console/page-remove', page)
      const result = dispose()
      this.ctx.emit('console/page-update', this.pages.map(e => e[1]))
      return result
    }
  }
}

export const name = 'internal'

export function apply(ctx: Context) {
  Context.service('console', Console)
  ctx.console = new Console(ctx)
}