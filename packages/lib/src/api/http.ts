import { Context } from 'cordis'
import request from 'superagent'
import { Status } from '.'

const API_PREFIX = 'http://127.0.0.1/v1'

type QueryPromise<T> = (ctx: Context, params?: object) => Promise<QueryResponse<T>>

export interface QueryResponse<T> {
    code: number
    message?: string
    data?: T
}

const snake = (ctx: Context) => (message: string) => {
    ctx.console.snack(message)
}

export function query(path: string) {
    return async (ctx: Context, params?: object) => {
        const res = await request.get(API_PREFIX + path).query(params).catch(snake(ctx))
        if (!res) throw new Error(`failed to get ${path}`)
        return res.body
    }
}

export class HttpApi {
    constructor() {}
    getStatus = query('/status') as QueryPromise<Status>
}