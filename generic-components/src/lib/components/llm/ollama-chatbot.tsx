'use client';

import { ContentCopy, PlayArrow, Translate } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  TextareaAutosize,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  CardActions,
  Stack,
} from '@mui/material';
import { Message } from 'ollama';
import { chat, chatStreaming } from '../../services/llm-service';
import { readStreamableValue } from 'ai/rsc';

import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';

export interface OllamaChatBotProps {
  currentLLMModel: string;
}
export function OllamaChatBot(props: OllamaChatBotProps) {
  const [result, setResult] = useState('');
  const [textInput, setTextInput] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('French');
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
      content:
        'You are an expert translator. Answer with only the translation, no comment, no additional stuff.',
    };
    const humanMessage: Message = {
      role: 'user',
      content: `Translate ${textInput} into ${targetLanguage}.`,
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
  }, [props.currentLLMModel, targetLanguage, textInput]);

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar sx={{ cursor: 'grab' }} id="draghandler">
            <Translate />
          </Avatar>
        }
        title="Translation"
      />

      <CardContent>
        {/* <strong className="cursor"><div>Drag here</div></strong> */}
        <FormControl fullWidth>
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
          <TextField
            margin="normal"
            label="Target Language"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            placeholder="Enter the target language here"
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
