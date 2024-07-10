'use client'

import { PlayArrow } from "@mui/icons-material";
import { Button, CircularProgress, FormControl, Grid, Paper, TextField, Typography } from "@mui/material";
import {  Message } from "ollama"
import { chat } from '../../services/llm-service'

import { useCallback, useEffect, useState } from "react";

export interface OllamaChatBotProps {
  currentLLMModel:string
}
export  function OllamaChatBot(props: OllamaChatBotProps) {

  const [result, setResult] = useState("")
  const [textInput, setTextInput] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("French")
  const [waiting, setWaiting] = useState(false)

  const translate = useCallback(() => {
    setWaiting(true)
    const systemMessage:Message = {
      role: "system",
      content: "You are an expert translator. Answer with only the translation, no comment, no additional stuff."
    }
    const humanMessage:Message = {
      role: "user",
      content: `Translate ${textInput} into ${targetLanguage}.`
    }

    const messages = [
      systemMessage,
      humanMessage
    ]
    chat(props.currentLLMModel, messages).then(res => {
      setResult(res)
      setWaiting(false)
    })
    .catch(err => {
      console.log(err)
      setWaiting(false)
    })


  }, [props.currentLLMModel, targetLanguage, textInput])

  return (
  <Paper>
    <FormControl>
    <Typography textTransform="uppercase">Translation</Typography>
      <Grid gap={2} spacing={2} container>

      <Grid item xl={10}>
      <TextField
      label="Text input"
      multiline={true}
      fullWidth={true}
      value={textInput}
      onChange={(e) => setTextInput(e.target.value)}
      placeholder="Enter your input here"
      ></TextField>
      </Grid>
      <Grid item>
      <TextField
      label="Target Language"
      value={targetLanguage}
      onChange={(e) => setTargetLanguage(e.target.value)}
      placeholder="Enter the target language here"
      ></TextField>
      </Grid>
      <Grid item xs={12}>
      <Button variant="outlined" onClick={translate}><PlayArrow></PlayArrow></Button>
      </Grid>
      </Grid>
    </FormControl>
    {waiting ? <CircularProgress/> :<div>{result}</div>}
  </Paper>
  )

}
