// import { useAppDispatch, undo, redo, lr, tb } from '@cosmos-workspace-2023/cosmos-hooks';
import { Add, FolderOpen, Save, Delete, Undo, Redo, ArrowForward, ArrowDownward, Edit, Folder } from '@mui/icons-material';
import { Button, CssBaseline, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import SchemaIcon from '@mui/icons-material/Schema';
import styles from './project-edition-menu.module.css';

/* eslint-disable-next-line */
export interface ProjectEditionMenuProps {}

export function ProjectEditionMenu(props: ProjectEditionMenuProps) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const dispatch = useAppDispatch()
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleUndo = () => {
    // dispatch(undo())
    handleClose()
  }
  const handleRedo = () => {
    // dispatch(redo())
    handleClose()
  }

  const handleDagreLR = () => {
    // dispatch(lr())
    handleClose()
  }

  const handleDagreTB = () => {
    // dispatch(tb())
    handleClose()
  }

  const menu =  (
    <>
    <CssBaseline />
  <Menu
    id="menu-project"
    anchorEl={anchorEl}
    keepMounted
    open={Boolean(anchorEl)}
    onClose={handleClose}
    >
    <Paper sx={{ width: 320, maxWidth: '100%', maxHeight: '100%'}}>
    <MenuList>
      <MenuItem onClick={handleUndo}>
        <ListItemIcon><Undo></Undo></ListItemIcon>
        <ListItemText>Undo</ListItemText>
        <Typography variant="body2" color="text.secondary">
            ⌘Z
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleRedo}>
        <ListItemIcon><Redo></Redo></ListItemIcon>
        <ListItemText>Redo</ListItemText>
        <Typography variant="body2" color="text.secondary">
                ⌘Y
        </Typography>
      </MenuItem>
      <Divider></Divider>
      <MenuItem onClick={handleDagreLR}>
        <ListItemIcon><ArrowForward></ArrowForward></ListItemIcon>
        <ListItemText>Left to Right</ListItemText>
        <Typography variant="body2" color="text.secondary">
            ⌘H
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleDagreTB}>
        <ListItemIcon><ArrowDownward></ArrowDownward></ListItemIcon>
        <ListItemText>Top to Bottom</ListItemText>
        <Typography variant="body2" color="text.secondary">
            ⌘V
        </Typography>
      </MenuItem>
    </MenuList>
    </Paper>
    </Menu>
    </>
    )


    //return menu;
    return <>
    {/* <Tooltip title="Edition">
    <IconButton color='inherit' onClick={handleMenu}><Edit/></IconButton>
    </Tooltip> */}
    <Button onClick={handleMenu}  startIcon={<Edit/>} color='inherit' sx={{textTransform: 'none!important'}}>
    Edition...
    </Button>
    {/* <Typography variant='button'  sx={{ mr:2}}  onClick={handleMenu}>Edition</Typography> */}
    {menu}

    </>
}

export default ProjectEditionMenu;
