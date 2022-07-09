import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import * as Cordis from 'cordis'
import App from './app'
import { ConsoleContext } from '../lib/context'
import { BrowserRouter } from 'react-router-dom'
import internal from '../internal'

const ctx = new Cordis.Context()
ctx.plugin(internal)

const CtxApp = () => {
  useEffect(() => {
    // start ctx next tick
    setTimeout(() => ctx.start(), 0)
  }, [])
  return <App />
}

const app = document.getElementById('app')
ReactDOM
  .createRoot(app)
  .render(
    <BrowserRouter>
      <ConsoleContext.Provider value={ctx}>
        <CtxApp />
      </ConsoleContext.Provider>
    </BrowserRouter>
  )