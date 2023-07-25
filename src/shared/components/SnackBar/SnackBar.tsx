import { Alert, Button, IconButton, Snackbar } from '@mui/material';
import React, { useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
interface snackbarProps {
  isOpen: boolean;
  severity: any;
  message: any;
}

export const SnackBar = (props: snackbarProps) => {
  const [open, setOpen] = useState<boolean>(props.isOpen ?? false);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        onClose={handleClose}
        autoHideDuration={2000}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert
          onClose={handleClose}
          severity={props.severity}
          sx={{ width: '100%' }}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </>
  );
};

