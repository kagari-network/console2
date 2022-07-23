import { Context } from '@console2/lib'
import Home from '@mui/icons-material/Home'
import React from 'react'

export const name = 'hello'

export function apply(ctx: Context) {
  ctx.console.page({
    id: 'hello',
    name: 'hello',
    path: '/hello',
    icon: <Home />,
    content: <h1>Hello World</h1>
  })
}