"use client";

import { Button, Paper, Typography } from "@mui/material";
import { useState } from "react";


export const FileUpload = () => {
  const [files, setFiles] = useState<string[]>();
  const [fileNames, setFileNames] = useState<string[]>();

  const [fileEnter, setFileEnter] = useState(false);
  return (
    <Paper variant="outlined" sx={{paddingLeft:"1rem",
    paddingRight:"1rem",maxWidth:"64rem"}} >
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
                    // setFile(blobUrl);
                  }
                  console.log(`file.name = ${file?.name}`);
                }
                setFiles(tmpFiles)
                setFileNames(tmpFileNames)
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
              }
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {files && files.map((file,i) => (
            <div key={i+""}>
              {fileNames && <Typography>{fileNames[i]}</Typography>}
              <object
              style={{"borderRadius":"0.375rem","width":"100%","maxWidth":"20rem","height":"18rem"}}
              aria-label="arialabel"
              data={file}
              type="application/pdf" //need to be updated based on type of file
            />
          </div>
          ))}

          <Button
            onClick={() => setFiles(undefined)}
            sx={{"paddingTop":"0.5rem","paddingBottom":"0.5rem","paddingLeft":"1rem","paddingRight":"1rem","marginTop":"2.5rem","borderRadius":"0.25rem","outlineStyle":"none","letterSpacing":"0.1em","color":"#ffffff","textTransform":"uppercase","backgroundColor":"#DC2626"}}
          >
            Reset
          </Button>
        </div>
      )}
    </Paper>
  );
};
