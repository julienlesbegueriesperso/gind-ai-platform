'use client';

import {
  Article,
  Computer,
  Delete,
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
  SelectChangeEvent,
  Divider,
} from '@mui/material';
import { Message } from 'ollama';
import {

  FileUpload,
  GindIAContext,
  Message as MessageDB,
} from '@gind-ia-platform/generic-components';
import { readStreamableValue } from 'ai/rsc';

import { createRef, useCallback, useContext, useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { chatStreaming, getListOfLLMModels } from '../llm-service';
import { indexDocuments, removeIndex, retrieveFromDocs, summarizeDocs, detectLanguage } from '../rag-service';
import { Document } from "@langchain/core/documents";



const DEFAULT_SYSTEM_PROMPT = 'You are an assistant expert in scientific writing.'
const DEFAULT_SYSTEM_PROMPT_RAG = `You are an assistant expert in scientific writing. 
You are using documents provided in context to answer queries. `

const embeddingModels = ["mxbai-embed-large"]



export default function OllamaChatBot() {


  

  /* Model and chat */
  const [currentModel, setCurrentModel] = useState<string>();
  const [currentEmbeddingModel, setCurrentEmbeddingModel] = useState("mxbai-embed-large")
  const [models, setModels] = useState<string[]>();

  const [textInput, setTextInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    DEFAULT_SYSTEM_PROMPT
  );
  const [waiting, setWaiting] = useState(false);
  const [waitingSummary, setWaitingSummary] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message>();
  const textRef = createRef<HTMLTextAreaElement>(); //useRef<HTMLTextAreaElement>(null);
  const endMessageRef = createRef<HTMLDivElement>();

  const [filesToIndex, setFilesToIndex] = useState<string[]>()

  const [isRag, setIsRag] = useState(false)

  const updateCurrentModel = (e:SelectChangeEvent<string>) => {
    setCurrentModel(e.target.value);
  };

  const context = useContext(GindIAContext)

  const getDocuments = async (docs:Document[]) => {
    toast.info("Number of docs to index " + docs.length)
    if (docs && docs.length === 0) {
      setIsRag(false)
      if (context && context.currentUser && context.currentUser.currentProject) {
        await removeIndex(context.currentUser.name, context.currentUser.currentProject)
      }
    } else {
      setWaiting(true)
      if (context && context.currentUser && context.currentUser.currentProject) {
        const res = await indexDocuments(docs, context.currentUser.name, context.currentUser.currentProject, currentEmbeddingModel)
        console.log("index", res)
        if (res === "ok") {
          if (context && context.currentUser && context.currentUser.currentProject) {
            setIsRag(true)
          }
        } else {
          toast.error("index error")
        }
      } else {
        toast.error("index error")
      }
      setWaiting(false)
    }
  }

  const summarizeDocuments = async (docs:Document[]) => {
    toast.info("Number of docs to summarize " + docs.length)
    getDocuments(docs)
    if (docs && docs.length === 0) {
      if (context && context.currentUser && context.currentUser.currentProject) {
        await removeIndex(context.currentUser.name, context.currentUser.currentProject)
      }
    } else {
      setWaitingSummary(true)
      if (context && context.currentUser && context.currentUser.currentProject && currentModel) {
        const res = await summarizeDocs(docs, context.currentUser.name, context.currentUser.currentProject, currentModel)
        console.log("index", res)
        if (!res.startsWith("error")) {
          if (context && context.currentUser && context.currentUser.currentProject) {
            setMessages([...messages, {role: "assistant", content: res}])
          }
        } else {
          toast.error("error")
        }
      } else {
        toast.error("error")
      }
      setWaitingSummary(false)
    }
  }

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
    
    let input = textInput

    if (isRag) {
      if (context && context.currentUser && context.currentUser.currentProject && currentModel) {
        
        const docs = await retrieveFromDocs(context.currentUser.name, context.currentUser.currentProject, input)
        const language = await detectLanguage(docs, currentModel)
        console.log(language)
        if ((language as string).toLowerCase().includes("french")) {
          input = `
            En se basant sur le contexte suivant :
            
            ${docs}

            Réponds à la question suivante :

            ${input}

            en utilisant le langage détecté ici :

            ${language}
          `
        }
        else {
          input = `

            Based on the following context:
            
            
            ${docs}
            
            
            Answer the following query:

            ${input}

            by using the language detected here:

            ${language}
            
            
          `
        }
      console.log(input)
      } else {
        toast("error")
      }
    }
    
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
      content: input // `${textInput}`,
    };

    const newMessages = [systemMessage, ...messages, humanMessage];

    const { _, newMessage } = await chatStreaming(
      currentModel || '',
      newMessages
    );
    setTextInput("")

    let textContent = '';
    humanMessage.content = textInput
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
            <>
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
            <Divider orientation='vertical'></Divider>
            <FormControl sx={{ width: '10vw' }} margin="normal">
              <InputLabel sx={{ margin: '-5pt' }} shrink={true}>
                LLM Embedding Model chosen
              </InputLabel>
              <Select
                notched={true}
                color="secondary"
                type="text"
                value={currentEmbeddingModel}
                variant="outlined"
                onChange={(e) => setCurrentEmbeddingModel(e.target.value)}
              >
                {embeddingModels.map((m, i) => (
                  <MenuItem key={i} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Grid container gap={2}>
        <Grid item xs={6}>
      {currentModel &&  <Card variant="outlined" sx={{margin:"20pt", background:'lavenderblush'}}>
        <CardHeader
          avatar={
            <Avatar sx={{ cursor: 'grab' }} id="draghandlerg">
              <SmartToy />
            </Avatar>
          }
          action={<Button onClick={() => setMessages([])} startIcon={<Delete/>}>Clear all</Button>}
          title="Assistant"
        >
        </CardHeader>
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
                <Button onClick={() => setMessages([...messages.filter((m,j) => j!==i )]) }><Delete color='error'></Delete></Button>
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
<div  style={{background:'yellow'}} ref={endMessageRef}></div>
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
              {(waiting||waitingSummary) ? <CircularProgress /> : <Send/>}
            </Button>
          </Stack>
        </CardActions>
      </Card>}
      </Grid>
      <Grid item xs={5}>
        <Card sx={{overflow: "auto", height: "74vh"}}> 
          <CardContent>
            {(waiting||waitingSummary) && <CircularProgress/>}
      <FileUpload getDocuments={getDocuments} summarizeDocs={summarizeDocuments}/>
      </CardContent>
      </Card>
      </Grid>
      </Grid>
    </div>
  );
}
