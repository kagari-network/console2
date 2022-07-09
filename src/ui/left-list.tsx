import React from 'react'
import {
  List, ListItem, ListItemButton,
  ListItemIcon, ListItemText
} from '@mui/material'
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom'
import { ConsolePlugin } from '../lib'

export default function LeftList({ plugins, open }: {
  plugins: ConsolePlugin[]
  open: boolean
}) {
  const nav = useNavigate()
  const location = useLocation()
  const items = plugins.map(plugin => (
    <ListItem disablePadding key={plugin.id || plugin.name}>
      <ListItemButton
        sx={{ justifyContent: open ? 'initial' : 'center' }}
        onClick={() => nav(plugin.path)}
        selected={!!matchRoutes([{ path: plugin.path }], location)}>
        <ListItemIcon sx={{ mr: open ? 3 : 'auto', justifyContent: 'center' }}>
          {plugin.icon}
        </ListItemIcon>
        <ListItemText sx={{ opacity: open ? 1 : 0 }}>{plugin.name}</ListItemText>
      </ListItemButton>
    </ListItem>
  ))
  return <List>{items}</List>
}