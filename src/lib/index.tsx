import { ReactElement } from 'react'

export interface Page {
  id: string
  name: string
  path: string
  icon: ReactElement
  content: ReactElement
}

export * from './context'