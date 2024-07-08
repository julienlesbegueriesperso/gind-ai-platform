import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import React, { useState } from 'react';
import styles from './project-open-dialog.module.css';

/* eslint-disable-next-line */
export interface ProjectOpenDialogProps {
  open: boolean;
  exitingProjectNames: string[];
  onClose: (value: string) => void;
}

export function ProjectOpenDialog(props: ProjectOpenDialogProps) {
  const { onClose, open, exitingProjectNames } = props;
  const [selectedValue, setSelectedValue] = useState<string>("")


  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleCancel = () => {
    onClose("")
  }

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value)
  }


  
  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth={true}>
    <DialogTitle>Open Project</DialogTitle>
    <DialogContent>
          <DialogContentText>
            Select a project
          </DialogContentText>
          <FormControl variant="standard" fullWidth={true} sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Project Name</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selectedValue}
          onChange={handleChange}
          label="Project Name"
        >
           <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {exitingProjectNames && exitingProjectNames.map(p => 
            <MenuItem key={p} value={p}>
            {p}
          </MenuItem>
          )}
        </Select>
      </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCancel}>Cancel</Button>
          <Button variant='contained' onClick={handleClose} disabled={!selectedValue || selectedValue === ""}>Open</Button>
        </DialogActions>
  </Dialog>
  );
}

export default ProjectOpenDialog;
