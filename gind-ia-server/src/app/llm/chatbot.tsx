'use client'
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { PlayArrow } from "@mui/icons-material";
import { Button, CircularProgress, FormControl, Grid, Paper, TextField, Typography } from "@mui/material";


import { useCallback, useEffect, useState } from "react";

export   function GindChatBot() {

  const [result, setResult] = useState("")
  const [textInput, setTextInput] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("French")
  const [waiting, setWaiting] = useState(false)

  const translate = useCallback(() => {
    setWaiting(true)
    const test = async () => {
      try {
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are an expert translator. Answer with only the translation, no comment, no additional stuff.`,
        ],
        ["human", `Translate "{input}" into {language}.`],
      ]);

      const model = new ChatOllama({
        // baseUrl: "http://api.example.com",
        model: "llama3:8b",
        // format: "json",
      });

      const chain = prompt.pipe(model);

      const result = await chain.invoke({
        input: textInput,
        language: targetLanguage,
      });
      console.log(result)
      setResult(JSON.stringify(result.content).replace("\"", "").replace("\n", "").trim())
    }
    catch (e) {
      console.log(e)
    }
    finally {
      setWaiting(false)
    }

      // return result
    }
    test()
  }, [targetLanguage, textInput])

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
