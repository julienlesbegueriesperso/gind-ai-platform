'use client';

import { Article, ContentCopy, Edit, PlayArrow, Translate } from '@mui/icons-material';
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
} from '@mui/material';
import { Message } from 'ollama';
import { chatStreaming } from '../../services/llm-service';
import { readStreamableValue } from 'ai/rsc';

import { createRef, useCallback, useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';


export interface OllamaChatBotGenericProps {
  currentLLMModel: string;
}
export function OllamaChatBotGeneric(props: OllamaChatBotGenericProps) {
  const [result, setResult] = useState('');
  const [textInput, setTextInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState("You are an assistant expert in scientific writing.")
  const [waiting, setWaiting] = useState(false);

  const textRef = createRef<HTMLTextAreaElement>(); //useRef<HTMLTextAreaElement>(null);

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

  const translate = useCallback(async () => {
    setWaiting(true);
    const systemMessage: Message = {
      role: 'system',
      content: systemPrompt,
    };
    const humanMessage: Message = {
      role: 'user',
      content: `${textInput}`,
    };

    const messages = [systemMessage, humanMessage];
    const { _, newMessage } = await chatStreaming(
      props.currentLLMModel,
      messages
    );
    let textContent = '';

    for await (const delta of readStreamableValue(newMessage)) {
      textContent = `${textContent}${delta}`;
      setWaiting(false);
      setResult(textContent);
    }
  }, [props.currentLLMModel, systemPrompt, textInput]);

  return (
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

        <Button variant="outlined" onClick={translate} disabled={waiting}>
          {waiting ? <CircularProgress /> : <PlayArrow></PlayArrow>}
        </Button>
        <textarea

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
        )}
        </Stack>
      </CardActions>
    </Card>
  );
}
