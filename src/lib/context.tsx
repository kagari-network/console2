import { Context, Fork } from 'cordis'
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react'

const ConsoleContext = React.createContext<Context>(null)

const usePluginContext = () => {
  const oldCtx = useContext(ConsoleContext)
  const [ctx, setCtx] = useState<Context>(null)
  useEffect(() => {
    const fork = oldCtx.plugin(ctx => setCtx(ctx))
    return () => { fork?.dispose() }
  }, [oldCtx])
  return ctx
}

const pluginWrapper = <T,>(InputComponent: React.ComponentType<T & {
  ctx: Context
}>) => function PluginWrapper(props: T) {
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
}>) => function ContextWrapper(props: T) {
  const ctx = useContext(ConsoleContext)
  return <InputComponent {...props} ctx={ctx} />
}

const ContextComponent = <P extends PropsWithChildren>(props: P) => {
  const ctx = useContext(ConsoleContext)
  return (
    <ConsoleContext.Provider value={ctx}>
      {props.children}
    </ConsoleContext.Provider>
  )
}

export { ConsoleContext, PluginComponent, ContextComponent, pluginWrapper, contextWrapper, usePluginContext }