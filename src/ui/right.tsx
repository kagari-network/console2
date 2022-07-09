import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ConsolePlugin } from '../lib'
import { PluginComponent } from '../lib/context'

export default ({ plugins }: {
  plugins: ConsolePlugin[]
}) => {
  const routes = plugins.map(plugin => (
    <Route key={plugin.id || plugin.name} path={plugin.path} element={
      <PluginComponent>{plugin.content}</PluginComponent>
    } />
  ))
  const main = plugins.filter(plugin => plugin.main)[0]
  if (main) routes.push(
    <Route key="__console_main" path="*" element={<Navigate to={main.path} replace />} />
  )
  return <Routes>{routes}</Routes>
}