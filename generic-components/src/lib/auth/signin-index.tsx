import { AppBar, Button, IconButton, Toolbar, Typography, styled, useTheme } from "@mui/material"
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react"
import Image from 'next/image'
import logoPic from "./logo.jpg" //'./cosmos_logo_app.svg'
import { Login, Logout } from "@mui/icons-material"
import ProjectMenu from "../components/project-components/project-menu"
import GindIAContext from "../context/gind-ia-context"
import { UserDocument } from "../models/user"
import { ProjectDocument, ChannelDocument } from "../models/project"
import { addUser, getUserByEmail } from "../services/user-service"
import { addProject } from "../services/project-service"

export interface SigninIndexProps {
  children: React.ReactNode
  publicContent: React.ReactNode
  links: React.ReactNode
}


export function SigninIndex(props:SigninIndexProps) {
  const { data: session } = useSession()

  const theme = useTheme();

  const [currentUser, setCurrentUser] = useState<UserDocument>()

  useEffect(() => {

    if (session && session.user && session.user.email) {
      const getAwaitUser = async (email:string) => {
        let cu:UserDocument = await getUserByEmail(email)
        if (!cu) {
          const tmp:UserDocument = {
            name: session.user?.name||"",
            email: session.user?.email||"",
            createdAt: new Date(),
          }
          console.log("adding user")
          await addUser(tmp)
          cu = tmp
        }
        if (!cu.currentProject) {
          const channel:ChannelDocument = {
            name: "unnamed channel",
            messages: []
          }
          const pr:ProjectDocument = {
            name: "project",
            owner: cu.email,
            channels: [channel],
          }
          addProject(pr)
          cu.currentProject = pr.name
        }

        setCurrentUser(cu)
        console.log("current user", cu)
      }
      getAwaitUser(session.user.email)
    }
  }, [session])


  // const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

  return (<GindIAContext.Provider value={{currentUser: currentUser, setCurrentUser: setCurrentUser}}>
    <AppBar position="sticky" variant="outlined">
          <Toolbar>
          <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="menu"
              // onClick={toggleDrawer(true)}
            >
              {/* <MenuIcon /> */}
              {/* <SvgIcon component={CosmosLogo} inheritViewBox></SvgIcon> */}
              <Image src={logoPic} alt="Logo" width={75} height={75} priority={true} ></Image>
             
          </IconButton>
          {/* <span style={{width:'5pt'}}></span> */}
          {props.links}
          {/* {session && <ProjectMenu closeProject={() => {}} deleteProject={() => {}}
          projects={[]}
          openProject={() => {}} getProjectName={() => "kk"}/>} */}
          <div style={{position:"fixed", right:"20pt"}}>
          {session &&
          <div>

          <Button sx={{display:"inline-block"}} variant="contained" startIcon={<Logout/>} onClick={() => signOut()}>Sign out</Button>
        </div>
        }
      {!session &&
      <div style={{flex:1}}>
      {/* <Typography>Not signed in</Typography> */}
      <Button  variant="contained" startIcon={<Login/>} onClick={() => signIn()}>Sign in</Button>
      </div>
      }
      </div>

          </Toolbar>
    </AppBar>
    {/* <Offset /> */}
    <div style={{overflow:"auto", height:"80vh"}}>

    {session && props.children}
    {!session && props.publicContent}
    {/* {session && <div>session {JSON.stringify(session)}</div>}
    {currentUser && <div>user {JSON.stringify(currentUser)}</div>} */}
    </div>
    <footer style={{display: "flex", justifyContent: "center",
                    padding: "3vh", backgroundColor: theme.palette.primary.main,
                    }}>
                      {session && <Typography variant="body2" display="inline-block" margin="5pt">Signed in as {JSON.stringify(session.user)}</Typography>}
                    </footer>
    </GindIAContext.Provider>

  )
}

export default SigninIndex
