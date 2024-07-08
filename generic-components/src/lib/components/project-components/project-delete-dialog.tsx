import styles from './project-delete-dialog.module.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from '@mui/material';

/* eslint-disable-next-line */
export interface ProjectDeleteDialogProps {
  open: boolean;
  onClose: (deleteCurrentProject: boolean) => void;

}

export function ProjectDeleteDialog(props: ProjectDeleteDialogProps) {
  
  const { onClose, open } = props;

  
  const handleClose = () => {
    onClose(false)
  };

  const handleDelete = () => {
    onClose(true)
  }



  return (
      <Dialog
        fullWidth={true}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Alert severity="warning">Delete Project</Alert>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure? 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>Disagree</Button>
          <Button variant='contained' color="warning" onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default ProjectDeleteDialog;
