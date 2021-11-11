import { useState } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import { Button } from '@mui/material';

import './clipboard-copy.scss';

function ClipboardCopy({ url }) {
  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return navigator.clipboard.writeText(text);
    }
    return document.execCommand('copy', true, text);
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(url)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, 2500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="copy-wrapper">
      <Button className="copy-button" type="button" onClick={handleCopyClick}>
        <LinkIcon className="copy-icon" />
        <div
          className="copy-text"
          style={{
            transition: 'all 0.3s ease-in',
            opacity: isCopied ? '0.7' : '1',
          }}
        >
          {isCopied ? 'Copied!' : 'Copy Link'}
        </div>
      </Button>
    </div>
  );
}

export default ClipboardCopy;
