import { Dialog, List, ListItem } from '@mui/material';
import { TwitterShareButton, LinkedinShareButton, FacebookShareButton } from 'react-share';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './community-share-dialog.scss';
import React from 'react';
import ClipboardCopy from './clipboard-copy';

export interface SimpleDialogProps {
  open: boolean;
  community: any;
  onClose: () => void;
}

function ShareDialog(props: SimpleDialogProps) {
  const { onClose, community, open } = props;

  const handleClose = () => {
    onClose();
  };

  // TODO once we have the community page ready, we will set the correct URL using the community address
  const url = 'https://skillwallet.id/';

  return (
    <Dialog onClose={handleClose} open={open}>
      <List sx={{ p: '15px' }}>
        <ListItem>
          <TwitterShareButton url={url} height="100px" className="social-button" title={`I just joined the ${community?.name} community!`}>
            <TwitterIcon className="social-icon" />
            <div className="social-name">Twitter</div>
          </TwitterShareButton>
        </ListItem>

        <ListItem>
          <FacebookShareButton
            url={url}
            height="100px"
            width="150px"
            className="social-button"
            quote={`I just joined the ${community?.name} community!`}
            hashtag="#DistributedTown"
          >
            <FacebookIcon className="social-icon" />
            <div className="social-name">Facebook</div>
          </FacebookShareButton>
        </ListItem>
        <ListItem>
          <LinkedinShareButton url={url} height="100px" className="social-button">
            <LinkedInIcon className="social-icon" />
            <div className="social-name">LinkedIn</div>
          </LinkedinShareButton>
        </ListItem>
        <ListItem>
          <ClipboardCopy url={url} />
        </ListItem>
      </List>
    </Dialog>
  );
}

export default ShareDialog;
