import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Cordis from 'cordis'
import App from './app'
import { ConsoleContext } from '../lib/context'
import { BrowserRouter } from 'react-router-dom'
import * as console from '../console'

const ctx = new Cordis.Context()
ctx.plugin(console)

const app = document.getElementById('app')
ReactDOM
  .createRoot(app)
  .render(
    <BrowserRouter>
      <ConsoleContext.Provider value={ctx}>
        <App />
      </ConsoleContext.Provider>
    </BrowserRouter>
  )

ctx.start()