import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function EinkaufsDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
        <Button className="confirm-button" variant="success" onClick={handleClickOpen}>
          Einkauf bestätigen
        </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Einkaufübersicht"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sind sie sich sicher, dass Sie das alles kaufen wollen?
            TODO
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="secondary">Zurück</Button>
          <Button onClick={() => {handleClose(); props.submitEinkauf();}} variant="success" autoFocus>
            Einkauf bestätigen
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
