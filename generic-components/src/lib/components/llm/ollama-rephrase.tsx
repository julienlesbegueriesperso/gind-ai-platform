'use client';

import { ContentCopy, Edit, PlayArrow, Translate } from '@mui/icons-material';
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


export interface OllamaChatBotRephraseProps {
  currentLLMModel: string;
}
export function OllamaChatBotRephrase(props: OllamaChatBotRephraseProps) {
  const [result, setResult] = useState('');
  const [textInput, setTextInput] = useState('');
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
        `You are an assistant expert in scientific writing. Your role is to rephrase the query in a proper scientific language.
        Keep the original language of the input query.
        `,
    };
    const humanMessage: Message = {
      role: 'user',
      content: `Given the following input:
                ===
                ${textInput}.
                ===
                Detect the language, and rephrase the paragrpah input
                in a proper scientific text in the same language.
                You response must only consist of the rephrased paragraph.
      `,
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
  }, [props.currentLLMModel, textInput]);

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar sx={{ cursor: 'grab' }} id="draghandlerr">
            <Edit />
          </Avatar>
        }
        title="Rephrasing"
      />

      <CardContent>
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
