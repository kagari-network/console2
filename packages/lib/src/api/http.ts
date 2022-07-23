import { Context } from 'cordis'
import request from 'superagent'

const API_PREFIX = 'http://127.0.0.1:8080/v1'

export interface Status {
  status: 'online' | 'downgraded'
}

export type QueryPromise<T> = (params?: object) => Promise<QueryResponse<T>>

export interface QueryResponse<T> {
  message?: string
  data?: T
}

export class HttpApi {
  constructor(private ctx: Context) { }

  query(path: string) {
    return async (params?: object) => {
      const res = await request
        .get(API_PREFIX + path).query(params)
        .catch(e => this.ctx.console.snack(String(e)))
      if (!res) throw new Error(`failed to get ${path}`)
      return res.body
    }
  }

  getStatus = this.query('/status') as QueryPromise<Status>
}