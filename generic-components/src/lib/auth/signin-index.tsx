import { AppBar, Button, IconButton, Toolbar, Typography, styled, useTheme } from "@mui/material"
import { useSession, signIn, signOut } from "next-auth/react"
import React from "react"
import Image from 'next/image'
import logoPic from "./logo.jpg" //'./cosmos_logo_app.svg'
import { Login, Logout } from "@mui/icons-material"

export interface SigninIndexProps {
  children: React.ReactNode
  publicContent: React.ReactNode
}


export function SigninIndex(props:SigninIndexProps) {
  const { data: session } = useSession()

  const theme = useTheme();

  // const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

  return (<>
    <AppBar position="sticky">
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
              <Image src={logoPic} alt="Logo" width={75} height={75} ></Image>
          </IconButton>
          <div style={{position:"fixed", right:"20pt"}}>
          {session &&
          <div>
          <Typography display="inline-block" margin="5pt">Signed in as {session.user?.email}</Typography>
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
    <div style={{margin:"10pt", overflow:"auto", height:"80vh"}}>
    {session && props.children}
    {!session && props.publicContent}
    </div>
    <footer style={{display: "flex", justifyContent: "center",
                    padding: "3vh", backgroundColor: theme.palette.primary.main,
                    }}></footer>
    </>
  )
}

export default SigninIndex
