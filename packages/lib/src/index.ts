import { ReactElement } from 'react'

export interface Page {
  id: string
  name: string
  path: string
  icon: ReactElement
  content: ReactElement
}

export * from './ui'
export * from './api'
export * as console from './console'

export * from 'cordis'