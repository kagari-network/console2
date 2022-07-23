import { ConsoleContext, console } from '@console2/lib'
import { BrowserRouter } from 'react-router-dom'
import React, { PropsWithChildren, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import * as Cordis from 'cordis'
import App from './app'
import { nextTwoTick } from './utils'

const ctx = new Cordis.Context()
ctx.plugin(console)

const Ready = (props: PropsWithChildren & {
  ctx: Cordis.Context
}) => {
  useEffect(() => {
    nextTwoTick().then(() => props.ctx.start())
  }, [props.ctx])
  return <>{props.children}</>
}

const app = document.getElementById('app')
ReactDOM
  .createRoot(app)
  .render(
    <Ready ctx={ctx}>
      <BrowserRouter>
        <ConsoleContext.Provider value={ctx}>
          <App />
        </ConsoleContext.Provider>
      </BrowserRouter>
    </Ready>
  )