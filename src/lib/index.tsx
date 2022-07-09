import React from 'react'

interface ConsolePlugin {
  id?: string
  name: string
  icon: React.ReactNode
  path: string
  content: React.ReactNode
  main?: boolean
}

export { ConsolePlugin }