import { getCommunityInfo } from '@dito-api/skillwallet.api';
import { CircularProgress, ThemeOptions, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { DitoCreditsSvg, SwButton } from 'sw-web-shared';
import './join-success.scss';
import { useLocation } from 'react-router-dom';
import ShareDialog from './community-share-dialog';

const Emoji = (props) => (
  <span className="emoji" role="img" aria-label={props.label ? props.label : ''} aria-hidden={props.label ? 'false' : 'true'}>
    {props.symbol}
  </span>
);

const JoinSuccess = () => {
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const [community, setCommunity] = useState('');
  const [isLoading, setLoading] = useState(true);
  const { search } = useLocation();
  const communityAddress = new URLSearchParams(search).get('communityAddress');
  const diToCredits = new URLSearchParams(search).get('diToCredits');
  React.useEffect(() => {
    const fetchCommunity = async () => {
      const response = await getCommunityInfo(communityAddress);
      const { name } = await response.json();
      setCommunity(name);
      setLoading(false);
    };
    fetchCommunity();
  }, [communityAddress]);
  return (
    <>
      <div className="sw-join-success-wrapper">
        {isLoading ? (
          <div className="sw-spinner-wrapper">
            <CircularProgress sx={{ color: 'background.paper' }} />
          </div>
        ) : (
          <>
            <div className="sw-community-details-wrapper">
              <div className="sw-congrats-wrapper">
                <Typography sx={{ color: 'background.paper', mb: 5, textAlign: 'center' }} component="div" variant="h4">
                  Congrats!
                  <Emoji symbol="🎉" label="congratulations" />
                  <Emoji symbol="🎉" label="congratulations" />
                  <Emoji symbol="🎉" label="congratulations" />
                </Typography>
              </div>

              <Typography sx={{ color: 'background.paper', mb: 5, textAlign: 'center' }} component="div" variant="h5">
                You are now a member of {community}.
              </Typography>
              <Typography sx={{ color: 'background.paper', mb: 5, textAlign: 'center' }} component="div" variant="h5">
                Your new DITO credits are now:
              </Typography>
              <div className="sw-credits-wrapper">
                <DitoCreditsSvg height="50px" width="75px" />
                <Typography
                  sx={{
                    color: 'background.paper',
                    mb: 1,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                  component="div"
                  variant="h4"
                >
                  {diToCredits}
                </Typography>
              </div>
            </div>
            <div className="sw-share-button-wrapper">
              <SwButton
                sx={{ width: small ? '200px' : '300px' }}
                label={small ? 'Share' : 'Share  & Invite your peers'}
                onClick={handleClickOpen}
              />
              {/* <ShareDialog selectedValue={selectedValue} open={open} onClose={handleClose} /> */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default JoinSuccess;
