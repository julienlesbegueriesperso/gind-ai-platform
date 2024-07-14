'use client';

import {
  Article,
  Computer,
  Face,
  People,
  Send,
  SmartToy,
} from '@mui/icons-material';
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
  TextareaAutosize,
  Grid,
} from '@mui/material';
import { Message } from 'ollama';
import {
  chatStreaming,
  FileUpload,
  getListOfLLMModels,
  Message as MessageDB,
} from '@gind-ia-platform/generic-components';
import { readStreamableValue } from 'ai/rsc';

import { createRef, useCallback, useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';

export default function OllamaChatBot() {



  /* Model and chat */
  const [currentModel, setCurrentModel] = useState<string>();
  const [models, setModels] = useState<string[]>();

  const [textInput, setTextInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are an assistant expert in scientific writing.'
  );
  const [waiting, setWaiting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message>();
  const textRef = createRef<HTMLTextAreaElement>(); //useRef<HTMLTextAreaElement>(null);
  const endMessageRef = createRef<HTMLDivElement>();

  const updateCurrentModel = (e) => {
    setCurrentModel(e.target.value);
  };

  useEffect(() => {
    getListOfLLMModels().then((models) => {
      setModels(models);
      if (models.length > 0) {
        setCurrentModel(models[0]);
      }
    });
  }, []);

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

  useEffect(() => {
    endMessageRef.current?.scrollIntoView({behavior: "smooth"})
  }, [endMessageRef, currentMessage])

  const generate = useCallback(async () => {
    setWaiting(true);
    setTextInput("")
    let newAIMessage: Message = {
      role: 'assistant',
      content: "...",
    };
    setCurrentMessage(newAIMessage)
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
      currentModel || '',
      newMessages
    );
    let textContent = '';

    setMessages([...messages, humanMessage]);

    for await (const delta of readStreamableValue(newMessage)) {
      textContent = `${textContent}${delta}`;
      newAIMessage = {
        role: 'assistant',
        content: textContent,
      };
      setCurrentMessage(newAIMessage);
      // setResult(textContent);
    }
    setWaiting(false);
    setMessages([...messages, humanMessage, {...newAIMessage}]);
    setCurrentMessage(undefined)
  }, [currentModel, messages, systemPrompt, textInput]);

  return (
    <div>
      <AppBar position="relative" color="transparent" variant="outlined">
        <Toolbar>
          {models && currentModel && (
            <FormControl sx={{ width: '10vw' }} margin="normal">
              <InputLabel sx={{ margin: '-5pt' }} shrink={true}>
                LLM Model chosen
              </InputLabel>
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
      <Grid container gap={2}>
        <Grid item xs={6}>
      <Card variant="outlined" sx={{margin:"20pt", background:'lavenderblush'}}>
        <CardHeader
          avatar={
            <Avatar sx={{ cursor: 'grab' }} id="draghandlerg">
              <SmartToy />
            </Avatar>
          }
          title="Assistant"
        />
        <CardContent>
          <FormControl fullWidth>
            <TextField
              margin="normal"
              label="System prompt"
              // multiline={true}
              // minRows={3}
              fullWidth={true}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter your system prompt"
            ></TextField>
            <div style={{overflow:"auto", height:"35vh"}}>
            {messages.map((m, i, a) => (
              <Box key={i + ''}>
                {m.role === 'user' && <Face />}
                {m.role === 'assistant' && <SmartToy />}
                <TextareaAutosize
                  key={i + ''}
                  ref={textRef}
                  value={m.content}
                  style={{
                    borderRadius: '8px',
                    width: '100%',
                    border: '2pt solid cyan',
                    overflow: 'auto',
                    height: '100px',
                  }}
                  readOnly={true}
                ></TextareaAutosize>
              </Box>
            ))}
            {currentMessage && (
              <Box>
                <SmartToy />
                <TextareaAutosize
                  ref={textRef}
                  value={currentMessage.content}
                  style={{
                    borderRadius: '8px',
                    width: '100%',
                    border: '2pt solid cyan',
                    overflow: 'auto',
                    height: '100px',
                  }}
                  readOnly={true}
                ></TextareaAutosize>

              </Box>
            )}
<div ref={endMessageRef}></div>
            </div>
            <TextField
              sx={{background:'white'}}
              margin="normal"
              label="Text input"
              multiline={true}
              minRows={3}
              fullWidth={true}
              value={textInput}
              disabled={waiting}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your input here"
            ></TextField>
          </FormControl>

        </CardContent>
        <CardActions>
          <Stack spacing={2} width={'100%'}>
            <Button variant="outlined" onClick={generate} disabled={waiting}>
              {waiting ? <CircularProgress /> : <Send/>}
            </Button>
          </Stack>
        </CardActions>
      </Card>
      </Grid>
      <Grid item xs={3}>
        <Card>
          <CardContent>
      <FileUpload/>
      </CardContent>
      </Card>
      </Grid>
      </Grid>
    </div>
  );
}
