import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

// Confirm 컴포넌트 정의
export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
        onClick={onConfirm} 
        color="success" 
        variant='contained' 
        autoFocus
        sx={{
            ":hover": {backgroundColor:'#60ff64'}
        }}
        >
          확인
        </Button>
        
        <Button 
        onClick={onCancel} 
        color="error" 
        variant='contained'
        sx={{
            ":hover": {backgroundColor:'red'}
        }}
        >
          취소
        </Button>
        
      </DialogActions>
    </Dialog>
  );
}