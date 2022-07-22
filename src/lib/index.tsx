import { Context } from 'cordis'
import { ReactElement } from 'react'

export interface Page<C extends Context = Context> {
  id: string
  name: string
  path: string
  icon: ReactElement
  content: ReactElement
}

export * from './context'