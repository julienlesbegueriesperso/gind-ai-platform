'use client'
import { OllamaChatBotGeneric } from '../app/llm/ollama-generic';
import { OllamaChatBotTranslate } from '../app/llm/ollama-translate';
import { OllamaChatBotRephrase } from '../app/llm/ollama-rephrase';
import { getListOfLLMModels } from "../app/llm-service";

import { createRef, useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Toolbar, useTheme } from '@mui/material';
import Draggable from 'react-draggable'; // The default



  export default function Index() {
    const theme = useTheme()
    const [models, setModels] = useState<string[]>([])
    // const [currentProject, setCurrentProject] = useState<ProjectDocument>()
    const [currentModel, setCurrentModel] = useState<string>()
    // const context = useContext(GindIAContext)

    const nodeRef1 =  createRef<HTMLDivElement>();
    const nodeRef2 =  createRef<HTMLDivElement>();
    const nodeRef3 =  createRef<HTMLDivElement>();

    const updateCurrentModel = (e:SelectChangeEvent<string>) => {
      setCurrentModel(e.target.value)

    }

    useEffect(() => {
      console.log("get models")
      getListOfLLMModels().then(models => {
        console.log(models)
        setModels(models)
        if (models.length > 0) {
          setCurrentModel(models[0])
        }
      })
    }, [])

    return (
      <div>
        {/* <SignedContent publicContent={<p>public content</p>}>
          <> */}
            {/* <AppBar position="relative" color="transparent" variant="outlined"> */}
              <Toolbar>
                {models && currentModel && (
                  <FormControl sx={{ width: '10vw' }} margin="normal">
                    <InputLabel sx={{margin:'-5pt'}} shrink={true}>LLM Model chosen</InputLabel>
                    <Select
                    notched={true}
                      color="secondary"
                      type="text"
                      value={currentModel}
                      variant="outlined"
                      onChange={updateCurrentModel}
                    >
                      {models.map((m, i) => (
                        <MenuItem key={i} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <MenuItem>
            </MenuItem>
              </Toolbar>
            {/* </AppBar> */}
            <div
              id="dragparent"
              style={{
                position: 'relative',
                background: theme.palette.info.main,
                width: 'fullWidth',
                height: '4000px',

              }}
            >
              <Draggable
                nodeRef={nodeRef1}
                handle="#draghandlert"
                bounds="#dragparent"
              >
                <div style={{position:"absolute",top:5, left:5, width: '28%' }} ref={nodeRef1}>
                  {currentModel && (
                    <OllamaChatBotTranslate
                      currentLLMModel={currentModel}
                    ></OllamaChatBotTranslate>
                  )}
                </div>
              </Draggable>
              <Draggable

                nodeRef={nodeRef2}
                handle="#draghandlerr"
                bounds="#dragparent"
              >
                <div style={{position:"absolute", top:5, left:600, width: '28%' }} ref={nodeRef2}>
                  {currentModel && (
                    <OllamaChatBotRephrase
                      currentLLMModel={currentModel}
                    ></OllamaChatBotRephrase>
                  )}
                </div>
              </Draggable>
              <Draggable

                nodeRef={nodeRef3}
                handle="#draghandlerg"
                bounds="#dragparent"
              >
                <div style={{position:"absolute", top:5, left:1200, width: '28%' }} ref={nodeRef3}>
                  {currentModel && (
                    <OllamaChatBotGeneric currentLLMModel={currentModel}></OllamaChatBotGeneric>
                  )}
                </div>
              </Draggable>
            </div>
          {/* </>
        </SignedContent>
        <ToastContainer /> */}
      </div>
    );



  }

