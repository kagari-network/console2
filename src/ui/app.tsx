import React from 'react'
import { styled } from '@mui/material/styles'
import {
  Box, Drawer as MuiDrawer, AppBar as MuiAppBar,
  Toolbar, Typography, IconButton, Divider,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { styledMixin, transition } from './utils'
import LeftList from './left-list'
import Right from './right'

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

const plugins = []

export default function MiniDrawer() {
  const [open, setOpen] = (() => {
    const [state, setState] = React.useState(false)
    return [state, () => setState(state => !state)]
  })()

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
        <LeftList open={open} plugins={plugins} />
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Right plugins={plugins}/>
      </Box>
    </Box>
  )
}
