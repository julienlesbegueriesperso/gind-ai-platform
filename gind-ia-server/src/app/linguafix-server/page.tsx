'use client'
import {  addProject, deleteProject, getProject, getProjectsByOwner, GindChatBot,
  OllamaChatBot,
  GindIAContext, ProjectDocument, ProjectMenu, SignedContent, updateUser, UserDocument
   } from '@gind-ia-platform/generic-components';
import styles from './page.module.css';
import { useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, MenuItem, Toolbar, useTheme } from '@mui/material';
import { BackHand, Home, Undo } from '@mui/icons-material';




 function LingaFixDashboard() {
  const context =  useContext(GindIAContext)

  const [currentProject, setCurrentProject] = useState<ProjectDocument>()
  const [existingProjects, setExistingProjects] = useState<ProjectDocument[]>()

  const addAwaitProject = useCallback(async (projectName:string) => {
    console.log("add await project")
    if (context && context.currentUser) {
      const newProject:ProjectDocument = {
        name: projectName,
        owner: context.currentUser.name,
        channels: []
      }
      const added = await addProject(newProject)
      setCurrentProject(newProject)
      setExistingProjects(e => [...e?e:[], newProject])
      const updatedUser = {...context.currentUser, currentProject:projectName}
      // setCurrentUser(updatedUser)
      const up = await updateUser(JSON.parse(JSON.stringify(updatedUser)))
      console.log("update", up)
  }

  }, [context])



  const deleteAwaitProject = useCallback(async (name:string) => {
    const d = await deleteProject(name)
    setCurrentProject(undefined)
    if (existingProjects) {
      setExistingProjects([...existingProjects.filter(p => p.name !== name)])
    }

    if (context && context.currentUser) {
      const u = {...context.currentUser, currentProject:undefined}
      await updateUser(u)
    }
  }, [context, existingProjects])

  const getAwaitProject = useCallback(async (name:string) => {
    console.log("get await project")
    const project = await getProject(name)
    setCurrentProject(project)
    if (context && context.currentUser && project) {
      const updatedUser = {...context.currentUser, currentProject:project.name}
      // setCurrentUser(updatedUser)
      await updateUser(updatedUser)
    }

  }, [context])

  // const addAwaitProject = useCallback(async (newProject:Projec))

  const getAwaitProjects = useCallback(async (owner:string) => {
    console.log("get await projects")
    const projects  = await getProjectsByOwner(owner)
    setExistingProjects(projects)
  },[])

  useEffect(() => {
    if (context && context.currentUser) {
      // setCurrentUser(context.currentUser)
      console.log("get projects & project")
      getAwaitProjects(context.currentUser.name)
      if (context.currentUser.currentProject) {
        getAwaitProject(context.currentUser.currentProject)
      }
    }

  }, [context, getAwaitProject, getAwaitProjects])

  return (<>
  <AppBar position='relative' color="info" >
          <Toolbar>
            <MenuItem>
          <Link  scroll={false} href="/"><Home/></Link></MenuItem>
          {/* <ProjectMenu
          closeProject={() => setCurrentProject(undefined)}
          openProject={(name) => getAwaitProject(name)}
          deleteProject={(name) => deleteAwaitProject(name)}
          projects={existingProjects||[]}
          getProjectName={(newProjectName) => addAwaitProject(newProjectName)}
          ></ProjectMenu> */}
      </Toolbar>
        </AppBar>

        {currentProject && (<OllamaChatBot currentLLMModel='llama3:8b'></OllamaChatBot>)}
  </>)
}



export default function LinguafixServer() {

  const theme = useTheme()

  // useEffect(() => {
  //   const getAwaitUsers = async () =>  {
  //     const users = await getUsers()
  //     if (users) {
  //       setCpt(users.length+1)
  //       setUsers(users)
  //     }
  //   }

  //   getAwaitUsers()

  // }, [cpt])

  // const createNewUser = (name:string) => {

  //   const addUserAwait = async (name:string) => {
  //     const newUser:UserDocument = {
  //       name: name,
  //       phone : "06",
  //       email: "juju_" + cpt + "@juju.com",
  //       createdAt: new Date(),
  //       updatedAt : new Date(),
  //       image: "",
  //       password: "jojo"
  //     }
  //     await addUser(newUser)
  //     setCpt(cpt+1)
  //   }
  //   addUserAwait(name)
  // }

  return (
    <SignedContent publicContent={<h3>Public</h3>}>
      <div className={styles['container']}>
        <LingaFixDashboard></LingaFixDashboard>
        {/* <GindChatBot></GindChatBot> */}
      </div>
    </SignedContent>
  );
}
