import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Cordis from 'cordis'
import App from './app'
import { ConsoleContext } from '../lib/context'
import { BrowserRouter } from 'react-router-dom'

const ctx = new Cordis.Context()

const app = document.getElementById('app')
ReactDOM
  .createRoot(app)
  .render(
    <BrowserRouter>
      <ConsoleContext.Provider value={ctx}>
        <App></App>
      </ConsoleContext.Provider>
    </BrowserRouter>
  )

ctx.start()