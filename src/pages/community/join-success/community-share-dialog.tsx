import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { blue } from '@mui/material/colors';
import './community-share-dialog.scss';

const socials = ['Twitter', 'Facebook', 'LinkedIn'];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function ShareDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <List sx={{ pt: 0 }}>
        {socials.map((social) => (
          <ListItem button onClick={() => handleListItemClick(social)} key={social}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }} />
            </ListItemAvatar>
            <ListItemText primary={social} />
          </ListItem>
        ))}
        <ListItem autoFocus button onClick={() => handleListItemClick('copyLink')}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary="Copy Link" />
        </ListItem>
      </List>
    </Dialog>
  );
}

export default ShareDialog;
