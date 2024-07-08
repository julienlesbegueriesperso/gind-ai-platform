import WorkIcon from '@mui/icons-material/Work';
import { Button, CssBaseline, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import ProjectNewDialog from './project-new-dialog';
import Project, { ProjectDocument }  from "../models/project"
import ProjectDeleteDialog from './project-delete-dialog';
import ProjectOpenDialog from './project-open-dialog';
import { Add, Close, Delete, Folder, FolderOpen, Save } from '@mui/icons-material';
// import { useAppSelector, useAppDispatch, saved, save } from '@cosmos-workspace-2023/cosmos-hooks'



/* eslint-disable-next-line */
export interface ProjectMenuProps {
  getProjectName: (value: string) => void
  openProject: (value: string) => void
  deleteProject: (value: string) => void
  closeProject: () => void
  projects: ProjectDocument[]
}


export function ProjectMenu(props: ProjectMenuProps) {
  const [open, setOpen] = useState(false);
  const [openOpen, setOpenOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [projectName, setProjectName] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // const dispatch = useAppDispatch()

  // const flowState = useAppSelector(state => state.flow.value)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNewProject = () => {
    setOpen(true)
    handleClose();
  }

  const handleOpenProject = () => {
    setOpenOpen(true);
    handleClose();
  }


  const handleSaveProject = () => {
    // dispatch(save())
    handleClose()
  }

  const handleDeleteProjectDialog = () => {
    setOpenDelete(true)
    handleClose();
  }

  const handleNewProjectClose = (value: string|null)  => {
    if (value) {
      setProjectName(value)
      props.getProjectName(value)
    }
    setOpen(false)
  }

  const handleOpenProjectClose = (value: string|null)  => {
    if (value) {
      setProjectName(value)
      props.openProject(value)
    }
    setOpenOpen(false)
  }

  const handleCloseProject = () => {
    props.closeProject()
    // setOpen(false)
    handleClose()

  }

  const handleDeleteProject = (deleteCurrentProject: boolean) => {
    if (deleteCurrentProject) {
      props.deleteProject(projectName)
      setProjectName("")
    }
    setOpenDelete(false)

  }

  document.addEventListener('keydown', function(event){
    if (event.code === "KeyN" && event.metaKey === true) {
      event.stopPropagation()
      event.preventDefault()
      setOpen(true)

    }
    if (event.code === "KeyO" && event.metaKey === true) {
      event.stopPropagation()
      event.preventDefault()
      setOpenOpen(true)
    }
    if (event.code === "KeyD" && event.metaKey === true) {
      event.stopPropagation()
      event.preventDefault()
      setOpenDelete(true)
    }
  })

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
      <MenuItem onClick={handleNewProject}>
        <ListItemIcon><Add></Add></ListItemIcon>
        <ListItemText>New Project...</ListItemText>
        <Typography variant="body2" color="text.secondary">
        &#8997;⌘N
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleOpenProject}>
        <ListItemIcon><FolderOpen></FolderOpen></ListItemIcon>
        <ListItemText>Open Project...</ListItemText>
        <Typography variant="body2" color="text.secondary">
                ⌘O
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleSaveProject}>
        <ListItemIcon><Save></Save></ListItemIcon>
        <ListItemText>Save Project...</ListItemText>
        <Typography variant="body2" color="text.secondary">
                ⌘S
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleCloseProject}>
        <ListItemIcon><Close/></ListItemIcon>
        <ListItemText>Close Project</ListItemText>
        <Typography variant="body2" color="text.secondary">
                ⌘C
        </Typography>
      </MenuItem>
      <Divider></Divider>
      <MenuItem onClick={handleDeleteProjectDialog}>
        <ListItemIcon><Delete></Delete></ListItemIcon>
        <ListItemText>Delete Project...</ListItemText>
        <Typography variant="body2" color="text.secondary">
                ⌘D
        </Typography>
      </MenuItem>

    </MenuList>
    </Paper>
    </Menu>
    </>
    )


    //return menu;
    return <>
    {/* <Tooltip title="Project">
    <IconButton color='inherit' onClick={handleMenu}><Folder/></IconButton>
    </Tooltip> */}
    <Button onClick={handleMenu} startIcon={<Folder/>} color='inherit' sx={{textTransform: 'none!important'}}>
    Project...
    </Button>
    {menu}
    <ProjectNewDialog open={open} exitingProjectNames={props.projects.map(p => p.name)} onClose={handleNewProjectClose}></ProjectNewDialog>
    <ProjectOpenDialog open={openOpen} exitingProjectNames={props.projects.map(p => p.name)} onClose={handleOpenProjectClose}></ProjectOpenDialog>
    <ProjectDeleteDialog open={openDelete} onClose={handleDeleteProject}  ></ProjectDeleteDialog>
    </>
  }

  export default ProjectMenu;
