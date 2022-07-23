import React, { useState } from 'react'
import styled from '@emotion/styled'

type Props<T> = T extends React.ComponentType<infer P> ? P : never

export const transition = (...props: string[]) =>
  props.map(n => `${n} 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms`).join(',')

export const styledMixin =
  <P,>(component: React.ComponentType<P>) => <M,>() =>
    styled(component as React.ComponentType<P & M>)

export const useBoolean = (initialState = false) => {
  const [state, setState] = useState(initialState)
  return [state, () => setState(state => !state)] as const
}

export function nextTick() {
    return new Promise(resolve => setTimeout(resolve, 0))
}

export async function nextTwoTick() {
    await nextTick()
    await nextTick()
}

export { Props }