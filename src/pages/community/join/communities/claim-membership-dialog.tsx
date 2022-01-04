import { Dialog, DialogContent } from '@mui/material';

export const ClaimMembershipDialog = ({ open, handleClose, dialogContent, fullScreen = false }: any) => {
  const dialogSize = fullScreen
    ? {}
    : {
        minHeight: '400px',
        minWidth: '400px',
      };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      sx={{
        '& .MuiDialog-paper': {
          minWidth: '95%',
          minHeight: '90%',
          opacity: `${fullScreen ? '1' : '0.9'}`,
          border: `${fullScreen ? '0px' : '3px solid background.paper'}`,
          borderRadius: `${fullScreen ? '0px' : '8px'}`,
        },
      }}
    >
      <DialogContent
        sx={{
          ...dialogSize,
          bgcolor: 'primary.main',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          border: `${fullScreen ? '0px' : '3px solid background.paper'}`,
          borderRadius: `${fullScreen ? '0px' : '8px'}`,
        }}
      >
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};
