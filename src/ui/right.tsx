import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ConsolePlugin } from '../lib'
import { PluginComponent } from '../lib/context'

export default function Right({ plugins }: {
  plugins: ConsolePlugin[]
}) {
  const routes = plugins.map(plugin => (
    <Route key={plugin.id || plugin.name} path={plugin.path} element={
      <PluginComponent using={plugin.using}>{plugin.content}</PluginComponent>
    } />
  ))
  if (plugins.length !== 0) routes.push(
    <Route key="__console_main" path="*" element={<Navigate to={plugins[0].path} replace />} />
  )
  return <Routes>{routes}</Routes>
}