import { Page } from '@console2/lib'
import React from 'react'
import {
  List, ListItem, ListItemButton,
  ListItemIcon, ListItemText
} from '@mui/material'
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom'

export default function LeftList({ pages, open }: {
  pages: Page[]
  open: boolean
}) {
  const nav = useNavigate()
  const location = useLocation()
  const items = pages.map(page => (
    <ListItem disablePadding key={page.id || page.name}>
      <ListItemButton
        sx={{ justifyContent: open ? 'initial' : 'center' }}
        onClick={() => nav(page.path)}
        selected={!!matchRoutes([{ path: page.path }], location)}>
        <ListItemIcon sx={{ mr: open ? 3 : 'auto', justifyContent: 'center' }}>
          {page.icon}
        </ListItemIcon>
        <ListItemText sx={{ opacity: open ? 1 : 0 }}>{page.name}</ListItemText>
      </ListItemButton>
    </ListItem>
  ))
  return <List>{items}</List>
}