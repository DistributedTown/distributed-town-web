import { Dialog, DialogContent } from '@mui/material';

export const ClaimMembershipDialog = ({ open, handleClose, dialogContent, fullScreen = false }: any) => {
  const dialogSize = fullScreen
    ? {}
    : {
        minWidth: '400px',
        minHeight: '400px',
      };
  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
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
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};
