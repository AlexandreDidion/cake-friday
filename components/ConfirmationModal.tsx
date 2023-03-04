import { useState } from 'react'

import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

export const ConfirmationModal = (
  {
    open = false,
    title = 'Are you sure ?',
    content = 'Please confirm',
    onClose,
    onConfirm
  }
  :
  {
    open?: boolean ,
    title?: string,
    content?: string | JSX.Element | JSX.Element[],
    onClose?: () => void,
    onConfirm?: () => void
  }
  ) => {
    const [show, setShow] = useState(open)

  const handleClose = () => {
    console.log('close')
    setShow(false)
    if (onClose) onClose()
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
  }

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {content}
      </DialogContent>
      <DialogActions>
        <Button  onClick={handleClose}>
          Cancel
        </Button>
        <Button autoFocus onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
