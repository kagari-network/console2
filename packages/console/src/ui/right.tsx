import { Page, PluginComponent } from '@console2/lib'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function Right({ pages }: {
  pages: Page[]
}) {
  const routes = pages.map(page => (
    <Route key={page.id || page.name} path={page.path} element={
      <PluginComponent>{page.content}</PluginComponent>
    } />
  ))
  const element = pages.length !== 0 ?
    <Navigate to={pages[0].path} replace /> :
    <></>
  routes.push(<Route key="__console_main" path="*" element={element} />)
  return <Routes>{routes}</Routes>
}