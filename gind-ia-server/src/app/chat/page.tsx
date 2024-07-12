'use client';

import { Article, Computer, ContentCopy, Edit, People, PlayArrow, Translate } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  TextField,
  CardActions,
  Stack,
  Box,
  AppBar,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@mui/material';
import { Message } from 'ollama';
import { chatStreaming, getListOfLLMModels, Message } from '@gind-ia-platform/generic-components';
import { readStreamableValue } from 'ai/rsc';

import { createRef, useCallback, useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { models } from 'mongoose';



export default function OllamaChatBot() {
  const [currentModel, setCurrentModel] = useState<string>()
  const [models, setModels] = useState<string[]>()
  const [result, setResult] = useState('');
  const [textInput, setTextInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState("You are an assistant expert in scientific writing.")
  const [waiting, setWaiting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([])
  const textRef = createRef<HTMLTextAreaElement>(); //useRef<HTMLTextAreaElement>(null);


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


  //Function to add text to clipboard
  const copyToClipboard = () => {
    // Text from the html element
    const copyText = textRef.current ? textRef.current.value : '';
    // Adding text value to clipboard using copy function
    const isCopy = copy(copyText);

    //Dispalying notification
    if (isCopy) {
      toast.success('Copied to Clipboard');
    }
  };

  const generate = useCallback(async () => {
    setWaiting(true);
    const systemMessage: Message = {
      role: 'system',
      content: systemPrompt,
    };
    const humanMessage: Message = {
      role: 'user',
      content: `${textInput}`,
    };

    const newMessages = [systemMessage, ...messages, humanMessage];

    const { _, newMessage } = await chatStreaming(
      currentModel||"",
      newMessages
    );
    let textContent = '';
    const newAIMessage:Message = {
      role: "assistant",
      content: textContent
    }
    setMessages([...messages, humanMessage, newAIMessage])

    for await (const delta of readStreamableValue(newMessage)) {
      textContent = `${textContent}${delta}`;
      newAIMessage.content = textContent
      // setResult(textContent);
    }
    setWaiting(false);

  }, [currentModel, messages, systemPrompt, textInput]);

  return (<div>
    <AppBar position="relative" color="transparent" variant="outlined">
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

                </Toolbar>
                </AppBar>
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar sx={{ cursor: 'grab' }} id="draghandlerg">
            <Article />
          </Avatar>
        }
        title="Generic"
      />
      <CardContent>
        <FormControl fullWidth>
        <TextField
            margin="normal"
            label="System prompt"
            multiline={true}
            minRows={3}
            fullWidth={true}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter your system prompt"
          ></TextField>
          {messages.map((m,i, a) => {
          if (i === a.length-1) {
            return (
              <Box key={i+""}>
                {m.role==="user" && <People/>}
                {m.role==="assistant" && <Computer/>}
                <Typography key={i+""} ref={textRef}>{m.content}</Typography>
              </Box>


          )
          }
          return
          (
            <Box key={i+""}>
              {m.role==="user" && <People/>}
              {m.role==="assistant" && <Computer/>}
              <Typography key={i+""}>{m.content}</Typography>
            </Box>


        )})}
          <TextField
            margin="normal"
            label="Text input"
            multiline={true}
            minRows={3}
            fullWidth={true}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter your input here"
          ></TextField>
        </FormControl>
      </CardContent>
      <CardActions>
        <Stack spacing={2} width={"100%"}>

        <Button variant="outlined" onClick={generate} disabled={waiting}>
          {waiting ? <CircularProgress /> : <PlayArrow></PlayArrow>}
        </Button>
        {/* <textarea

          style={{
            borderRadius: '8px',
            width: 'fullWidth',
            border: '2pt solid cyan',
            overflow:"auto",
            height:"100px",


          }}
          value={result}
          readOnly={true}
          ref={textRef}
        ></textarea>
        {result && (
          <Button variant="outlined" onClick={copyToClipboard}>
            <ContentCopy />
          </Button>
        )} */}
        </Stack>
      </CardActions>
    </Card>
    </div>
  );
}
