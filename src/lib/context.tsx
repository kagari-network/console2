import { Context } from 'cordis'
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react'

const ConsoleContext = React.createContext<Context>(null)

const usePluginContext = () => {
  const ctx = useContext(ConsoleContext)
  const [newCtx, setNewCtx] = useState<Context>(null)
  useEffect(() => {
    const fork = ctx.plugin(ctx => setNewCtx(ctx))
    return () => { fork.dispose() }
  }, [ctx])
  return newCtx
}

const pluginWrapper = <T,>(InputComponent: React.ComponentType<T & {
  ctx: Context
}>) => (props: T) => {
  const ctx = usePluginContext()
  return !ctx ? null : (
    <ConsoleContext.Provider value={ctx}>
      <InputComponent {...props} ctx={ctx} />
    </ConsoleContext.Provider>
  )
}

const PluginComponent = <P extends PropsWithChildren>(props: P) => {
  const ctx = usePluginContext()
  return !ctx ? null : (
    <ConsoleContext.Provider value={ctx}>
      {props.children}
    </ConsoleContext.Provider>
  )
}

const contextWrapper = <T,>(InputComponent: React.ComponentType<T & {
  ctx: Context
}>) => (props: T) => {
  const ctx = useContext(ConsoleContext)
  return <InputComponent {...props} ctx={ctx} />
}

export { ConsoleContext, PluginComponent, pluginWrapper, contextWrapper, usePluginContext }