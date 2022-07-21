import { Context, Fork } from 'cordis'
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react'

const ConsoleContext = React.createContext<Context>(null)

const usePluginContext = (using: string[]) => {
  const oldCtx = useContext(ConsoleContext)
  const [[ctx, fork], setCtxAndFork] = useState<[Context, Fork]>([null, null])
  useEffect(() => {
    let newCtx: Context
    let newFork: Fork
    if (fork) {
      newCtx = null
      fork.restart()
      return
    }
    const setState = () => {
      if (newCtx && newFork) setCtxAndFork([newCtx, newFork])
    }
    const plugin = {
      using,
      apply(ctx: Context) {
        newCtx = ctx
        setState()
      },
    }
    newFork = oldCtx.plugin(plugin)
    setState()
    return () => { fork?.dispose() }
  }, [oldCtx, fork])
  return ctx
}

const pluginWrapper = <T,>(using: string[], InputComponent: React.ComponentType<T & {
  ctx: Context
}>) => function PluginWrapper(props: T) {
  const ctx = usePluginContext(using)
  return !ctx ? null : (
    <ConsoleContext.Provider value={ctx}>
      <InputComponent {...props} ctx={ctx} />
    </ConsoleContext.Provider>
  )
}

const PluginComponent = <P extends PropsWithChildren & {
  using?: string[]
}>(props: P) => {
  const ctx = usePluginContext(props.using)
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

export { ConsoleContext, PluginComponent, pluginWrapper, contextWrapper, usePluginContext }