#!/usr/bin/env node

const App = require('koa')
const { resolve } = require('path')
const { createReadStream } = require('fs')

const dist = resolve(__dirname, 'dist')
const index = resolve(__dirname, 'dist/index.html')

const app = new App()
app.use(require('koa-static')(dist))
app.use((ctx, next) => {
    ctx.body = createReadStream(index)
    return next()
})
app.listen(8080)