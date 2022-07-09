import React from 'react'
import styled from '@emotion/styled'

type Props<T> = T extends React.ComponentType<infer P> ? P : never

export const transition = (...props: string[]) =>
  props.map(n => `${n} 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms`).join(',')

export const styledMixin =
  <P,>(component: React.ComponentType<P>) => <M,>() =>
    styled<React.ComponentType<P & M>>(component as any)

export { Props }