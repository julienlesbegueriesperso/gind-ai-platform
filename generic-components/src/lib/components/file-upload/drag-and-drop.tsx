"use client";

import { Button, CardActions, Checkbox, FormControlLabel, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { Document } from "@langchain/core/documents";

export interface FileUploadProps {
  getDocuments: (docs:Document[]) => void
}


export const FileUpload = (props:FileUploadProps) => {
  const [files, setFiles] = useState<string[]>();
  const [filteredFiles, setFilteredFiles] = useState<boolean[]>([])
  const [fileNames, setFileNames] = useState<string[]>();
  const [documents, setDocuments] = useState<{[key:string]: Document<Record<string,any>>[]}>({})

  const [fileEnter, setFileEnter] = useState(false);

  const [indexEnabled, setIndexEnabled] = useState(true);

  return (
    <Paper variant="outlined" sx={{paddingLeft:"1rem",
    paddingRight:"1rem"}} >
      {!files? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setFileEnter(true);
          }}
          onDragLeave={(e) => {
            setFileEnter(false);
          }}
          onDragEnd={(e) => {
            e.preventDefault();
            setFileEnter(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setFileEnter(false);
            if (e.dataTransfer.items) {
              const tmpFiles:string[] = []
              const tmpFileNames:string[] = []
              for (const item of [...e.dataTransfer.items as any]) {
              // [...e.dataTransfer.items as any].forEach((item, i) => {
                if (item.kind === "file") {
                  const file = item.getAsFile();
                  if (file) {
                    const blobUrl = URL.createObjectURL(file);
                    tmpFiles.push(blobUrl)
                    tmpFileNames.push(file.name)
                    const loader = new WebPDFLoader(file)
                    loader.load().then(docs => {
                    documents[blobUrl] = docs
                    console.log(documents)
                    setDocuments({...documents})
                  })
                    // setFile(blobUrl);
                  }
                  console.log(`file.name = ${file?.name}`);
                }
                setFiles(tmpFiles)
                setFileNames(tmpFileNames)
                setFilteredFiles(Array.from({ length: tmpFiles.length }, (x, i) => true))
              // });
              }
            } else {
              [...e.dataTransfer.files as any].forEach((file, i) => {
                console.log(`… file[${i}].name = ${file.name}`);
              });
            }
          }}
          style={{"display":"flex","flexDirection":"column","justifyContent":"center","alignItems":"center","borderStyle":"dashed","width":"100%","maxWidth":"20rem","height":"18rem","backgroundColor":"#ffffff",
            borderWidth: fileEnter? "4px":"2px"
          }}
        >
          <label
            htmlFor="file"
            style={{"display":"flex","flexDirection":"column","justifyContent":"center","height":"100%","textAlign":"center"}}
          >
            Click to upload or drag and drop
          </label>
          <input
            id="file"
            type="file"
            multiple={true}
            className="hidden"
            onChange={(e) => {
              console.log(e.target.files);
              const files = e.target.files;
              if (files && files[0]) {
                const tmpFiles = []
                for (let i=0 ; i< files.length ; i++) {
                  const blobUrl = URL.createObjectURL(files[i]);
                  tmpFiles.push(blobUrl)
                  // setFile(blobUrl);
                }
                setFiles(tmpFiles)
                setFilteredFiles(Array.from({ length: tmpFiles.length }, (x, i) => true))
              }
            }}
          />
        </div>
      ) : (
        <Stack>
          <CardActions>
           <Button
            onClick={() => {
              setFiles(undefined)
              setFilteredFiles([])
              setDocuments({})
              setIndexEnabled(true)
              props.getDocuments([])
            }}
            sx={{"paddingTop":"0.5rem","paddingBottom":"0.5rem","paddingLeft":"1rem","paddingRight":"1rem","margin":"1.5rem","borderRadius":"0.25rem","outlineStyle":"none","letterSpacing":"0.1em","color":"#ffffff","textTransform":"uppercase","backgroundColor":"#DC2626"}}
          >
            Reset
          </Button>
          { indexEnabled && <Button
            
            
            onClick={() => {
              const selectedFiles = files.filter((f, i) => filteredFiles[i] === true)
              const res:{[key:string]: Document<Record<string,any>>[]} = {}
              for (const key of selectedFiles) {
                if (key in documents) {
                  res[key] = documents[key]
                }
              }
              setIndexEnabled(false)
              props.getDocuments(
                Object.values(res).flat().map(d => ({pageContent: d.pageContent, metadata: JSON.parse(JSON.stringify(d.metadata))}))
              )

          }
        }
            sx={{"paddingTop":"0.5rem","paddingBottom":"0.5rem","paddingLeft":"1rem","paddingRight":"1rem","margin":"1.5rem","borderRadius":"0.25rem","outlineStyle":"none","letterSpacing":"0.1em","color":"#ffffff","textTransform":"uppercase","backgroundColor":"#4444FF"}}
          >
            Index
          </Button>}
          </CardActions>
          {files && files.map((file,i) => (
            <div key={i+""}>
              {fileNames && <Typography>{file}</Typography>}
              {fileNames && <FormControlLabel label={fileNames[i]} control={<Checkbox checked={filteredFiles[i]}
                          onChange={(e) => {
                            filteredFiles[i] = !filteredFiles[i]
                            setFilteredFiles([...filteredFiles])
                          }}></Checkbox>}></FormControlLabel>}
              <object
              style={{"borderRadius":"0.375rem","width":"100%","height":"18rem"}}
              aria-label="arialabel"
              data={file}
              type="application/pdf" //need to be updated based on type of file
            />
          </div>
          ))}
          {/* {filteredFiles && <p>{JSON.stringify(filteredFiles)}</p>} */}
        </Stack>
      )}
    </Paper>
  );
};
