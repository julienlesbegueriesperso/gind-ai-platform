'use client'

import { PlayArrow } from "@mui/icons-material";
import { Button, CircularProgress, FormControl, Grid, Paper, TextField, Typography } from "@mui/material";
import {  Message } from "ollama"
import { chat, chatStreaming } from '../../services/llm-service'
import { readStreamableValue } from "ai/rsc";

import { useCallback, useEffect, useState } from "react";

export interface OllamaChatBotProps {
  currentLLMModel:string
}
export  function OllamaChatBot(props: OllamaChatBotProps) {

  const [result, setResult] = useState("")
  const [textInput, setTextInput] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("French")
  const [waiting, setWaiting] = useState(false)

  const translate = useCallback(async () => {
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
    const {_, newMessage} = await chatStreaming(props.currentLLMModel, messages)
    let textContent = "";

            for await (const delta of readStreamableValue(newMessage)) {
              textContent = `${textContent}${delta}`;
              setWaiting(false)
              setResult(textContent)
            }
  }, [props.currentLLMModel, targetLanguage, textInput])

  return (
  <Paper>
    <Grid gap={2} spacing={2} container>
    <Grid item xl={10}>
    <FormControl>
    <Typography textTransform="uppercase">Translation</Typography>

      <TextField
      label="Text input"
      multiline={true}
      fullWidth={true}
      value={textInput}
      onChange={(e) => setTextInput(e.target.value)}
      placeholder="Enter your input here"
      ></TextField>
      <TextField
      label="Target Language"
      value={targetLanguage}
      onChange={(e) => setTargetLanguage(e.target.value)}
      placeholder="Enter the target language here"
      ></TextField>


      <Button variant="outlined" onClick={translate}><PlayArrow></PlayArrow></Button>
    </FormControl>
    </Grid>
    <Grid item>
    {waiting ? <CircularProgress/> :<Typography>{result}</Typography>}
    </Grid>
    </Grid>
  </Paper>
  )

}
