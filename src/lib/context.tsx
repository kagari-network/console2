import { Context } from 'cordis'
import React, { useEffect, useState } from 'react'

const ConsoleContext = React.createContext<Context>(null)

const pluginWrapper = <T,>(InputComponent: React.ComponentType<T & {
	ctx: Context
}>) => (props: T) => {
	const ctx = React.useContext(ConsoleContext)
	const [newCtx, setNewCtx] = useState<Context>(null)
	useEffect(() => {
		const fork = ctx.plugin(ctx => { setNewCtx(ctx) })
		return () => { fork.dispose() }
	}, [])
	return !newCtx ? null : (
		<ConsoleContext.Provider value={newCtx}>
			<InputComponent {...props} ctx={newCtx} />
		</ConsoleContext.Provider>
	)
}

const contextWrapper = <T,>(InputComponent: React.ComponentType<T & {
	ctx: Context
}>) => (props: T) => {
	const ctx = React.useContext(ConsoleContext)
	return <InputComponent {...props} ctx={ctx} />
}

export { ConsoleContext, pluginWrapper, contextWrapper }