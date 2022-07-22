import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import {
  Box, Drawer as MuiDrawer, AppBar as MuiAppBar,
  Toolbar, Typography, IconButton, Divider,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { styledMixin, transition, useBoolean } from './utils'
import LeftList from './left-list'
import Right from './right'
import { pluginWrapper } from '../lib/context'
import { Page } from '../lib'

const drawerWidth = 240;

const AppBar = styledMixin(MuiAppBar)<{
  open?: boolean
}>()(({ open }) => `
  z-index: 2000;
  transition: ${transition('width', 'margin')};
  ${open ? `
    width: calc(100% - ${drawerWidth}px);
    margin-left: ${drawerWidth}px;
  ` : ''}
`)

const Drawer = styled(MuiDrawer)(({ open }) => `
  width: ${open ? drawerWidth : 56}px;
  transition: ${transition('width')};
  & > .MuiPaper-root {
    width: ${open ? drawerWidth : 56}px;
    transition: ${transition('width')};
    overflow-x: hidden;
  }
`)

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar
}))

const sortPages = (plugins: Page[]) =>
  plugins.map(page => ({ order: Infinity, ...page }))
    .sort((a, b) => a.order - b.order)

export default pluginWrapper(({ ctx }) => {
  const [pages, setPages] = useState([])
  const [open, setOpen] = useBoolean()

  useEffect(() => {
    // sortPlugins will create new array so Object.is returns false
    if (ctx.console) setPages(sortPages(ctx.console.pages))
    const listener = (pages: Page[]) => setPages(sortPages(pages))
    ctx.on('console/page-update', listener)
    return () => { ctx.off('console/page-update', listener) }
  }, [ctx])

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton color="inherit" onClick={setOpen} edge="start" sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>Console</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <Divider />
        <LeftList open={open} pages={pages} />
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Right pages={pages} />
      </Box>
    </Box>
  )
})