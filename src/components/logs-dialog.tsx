import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export const LogsDialog = ({ open, handleClose, logs, fullScreen = false }: any) => {
  const dialogSize = fullScreen
    ? {}
    : {
        minWidth: '400px',
        minHeight: '400px',
      };
  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Logs
        {handleClose ? (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent
        sx={{
          ...dialogSize,
          bgcolor: 'primary.main',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {logs.map((log, index) => {
          return (
            <Typography key={index} sx={{ color: 'text.primary', textAlign: 'center', pb: 1 }} component="div" variant="h6">
              {log}
            </Typography>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};
