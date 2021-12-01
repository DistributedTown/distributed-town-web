import { CircularProgress, ThemeOptions, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { DitoCreditsSvg, SwButton } from 'sw-web-shared';
import './join-success.scss';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@dito-store/store.model';
import { ResultState } from '@dito-store/status';
import { fetchCommunity } from '../store/community.reducer';
import ShareDialog from './community-share-dialog';

const JoinSuccess = () => {
  const dispatch = useDispatch();
  // const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);

  const { status, community } = useSelector((state: RootState) => state.community);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { search } = useLocation();
  const communityAddress = new URLSearchParams(search).get('communityAddress');
  const diToCredits = new URLSearchParams(search).get('diToCredits');
  useEffect(() => {
    if (!community || community?.address !== communityAddress) {
      dispatch(fetchCommunity(communityAddress));
    }
  }, [communityAddress, community, dispatch, search]);
  return (
    <>
      <div className="sw-join-success-wrapper">
        {status === ResultState.Loading ? (
          <div className="sw-spinner-wrapper">
            <CircularProgress sx={{ color: 'text.primary' }} />
          </div>
        ) : (
          <>
            <div className="sw-community-details-wrapper">
              <div className="sw-congrats-wrapper">
                <Typography sx={{ color: 'text.primary', mb: '45px', textAlign: 'center' }} component="div" variant="h1">
                  Congratulations
                </Typography>
              </div>

              <Typography sx={{ color: 'text.primary', mb: 2, textAlign: 'center' }} component="div" variant="h2">
                You are now a member of {community?.name}.
              </Typography>
              <Typography sx={{ color: 'text.primary', mb: 5, textAlign: 'center' }} component="div" variant="h2">
                Your new DITO credits are now:
              </Typography>
              <Typography
                sx={{
                  color: 'text.primary',
                  mb: 1,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
                component="div"
                variant="xl"
              >
                {diToCredits}
              </Typography>
            </div>
            <div className="sw-share-button-wrapper">
              <SwButton
                sx={{ width: '310px', height: '50px' }}
                label={small ? 'Share' : 'Share  & Invite your peers'}
                onClick={handleClickOpen}
              />
              <ShareDialog community={community} open={open} onClose={handleClose} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default JoinSuccess;
