import React from 'react'

interface ConsolePlugin {
  id?: string
  name: string
  icon: React.ReactNode
  path: string
  content: React.ReactNode
  order?: number
  using?: string[]
}

export * from './context'

export { ConsolePlugin }