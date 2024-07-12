'use client'
import { getListOfLLMModels,
  OllamaChatBot, SignedContent } from '@gind-ia-platform/generic-components';

import { createRef, useEffect, useState } from 'react';
import { AppBar, FormControl, InputLabel, MenuItem, Select, Toolbar, useTheme } from '@mui/material';
import Draggable from 'react-draggable'; // The default
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


  export default function Index() {
    const theme = useTheme()
    const [models, setModels] = useState<string[]>([])
    // const [currentProject, setCurrentProject] = useState<ProjectDocument>()
    const [currentModel, setCurrentModel] = useState<string>()
    // const context = useContext(GindIAContext)

    const nodeRef =  createRef<HTMLDivElement>();

    const updateCurrentModel = (e) => {
      setCurrentModel(e.target.value)

    }

    useEffect(() => {
      getListOfLLMModels().then(models => {
        setModels(models)
        if (models.length > 0) {
          setCurrentModel(models[0])
        }
      })
    }, [])

    return (
      <div>
        <SignedContent publicContent={<p>public content</p>}>
          <>
          <AppBar  position="relative" color="transparent" variant='outlined'>
          <Toolbar>
            {models && currentModel && (
              <FormControl sx={{width:"10vw"}} margin='normal' >
                <InputLabel>LLM Model chosen</InputLabel>
              <Select color='secondary'  type="text" value={currentModel} variant='outlined' onChange={updateCurrentModel}>
                {models.map((m, i) => (
                  <MenuItem key={i} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
            )}
            {/* <MenuItem>
              <Link scroll={false} href="/linguafix-server">
                <Translate /> Translate
              </Link>
            </MenuItem> */}

          </Toolbar>
        </AppBar>
        <div id="dragparent" style={{position:"relative", background:theme.palette.info.main, width: 'fullWidth', height:'70vh'}} >

        <Draggable nodeRef={nodeRef} handle='#draghandler' bounds="#dragparent">
            <div style={{width:"28%"}} ref={nodeRef}>
            {currentModel && <OllamaChatBot currentLLMModel={currentModel}></OllamaChatBot>}
            </div>
          </Draggable>
          </div>
          </>
        </SignedContent>
        <ToastContainer />
      </div>
    );



  }

