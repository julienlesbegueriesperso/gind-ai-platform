import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import React from 'react'

/* eslint-disable-next-line */
export interface ProjectNewDialogProps {
  open: boolean;
  
  exitingProjectNames: string[];
  onClose: (value: string) => void;
}

export function ProjectNewDialog(props: ProjectNewDialogProps) {
  const { onClose, open, exitingProjectNames } = props;
  const [isValid, setIsValid] = useState(false)  
  const [dirty, setDirty] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("")


  const handleClose = () => {
    isValid && 
    onClose(selectedValue);

    
  };

  const handleCancel = () => {
    console.log("cancel")
    onClose("")
  }

  const validateProjectName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
    if (event.target.value === "" ||
        exitingProjectNames.includes(event.target.value)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }
  
  return (
    <Dialog onClose={handleCancel} open={open} maxWidth="sm">
    <DialogTitle>Set Project Name</DialogTitle>
    <DialogContent>
          <DialogContentText>
            Type a name for your new Project, avoid spaces, "_", "-", special characters, etc.
          </DialogContentText>
          <TextField
            error={dirty && isValid === false}                                        
            autoFocus
            margin="dense"
            id="name"
            label="Project name"
            type="text"
            fullWidth
            variant="standard"
            onChange={validateProjectName}
            onBlur={() => setDirty(true)}
            value={selectedValue}
          />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCancel}>Cancel</Button>
          <Button variant='contained' onClick={handleClose} disabled={isValid===false}>Create</Button>
        </DialogActions>
  </Dialog>
  );
}

export default ProjectNewDialog;
