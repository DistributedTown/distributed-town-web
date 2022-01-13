import { CircularProgress, ThemeOptions, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { DitoCreditsSuccessLogoSvg, SwButton, SwShare } from 'sw-web-shared';
import './join-success.scss';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@dito-store/store.model';
import { ResultState } from '@dito-store/status';
import { fetchCommunity } from '../store/community.reducer';

const JoinSuccess = () => {
  const dispatch = useDispatch();
  // const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));
  const xsmall = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);

  const { status, community } = useSelector((state: RootState) => state.community);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // eslint-disable-next-line max-len
  const shareMessage = `Hey there! We've just deployed ${community?.name} on SkillWallet - choose your Role in our Community, pick your Skills, and let's build something great together!`;

  const { search } = useLocation();
  const communityAddress = new URLSearchParams(search).get('communityAddress');
  const diToCredits = new URLSearchParams(search).get('diToCredits');
  useEffect(() => {
    if (!community || community?.address !== communityAddress) {
      dispatch(fetchCommunity(communityAddress));
    }
  }, [communityAddress, community, dispatch, search]);
  return (
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
            <DitoCreditsSuccessLogoSvg className="sw-dito-credits" width="166px" />
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
              mode="light"
              label={small ? 'Share' : 'Share  & Invite your peers'}
              onClick={handleClickOpen}
            />
            <SwShare
              mode="dark"
              url="https://skillwallet.id/"
              title="with friends"
              sx={{
                '.MuiTypography-h2': {
                  mt: 0,
                },
                minHeight: `${xsmall ? '0' : '400px'}`,
                minWidth: `${xsmall ? '0' : '400px'}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                borderWidth: `${xsmall ? '0px' : '3px'}`,
                borderRadius: `${xsmall ? '0px' : '8px'}`,
              }}
              dialogsx={{
                '& .MuiDialog-paper': {
                  minWidth: '95%',
                  minHeight: '90%',
                  opacity: `${xsmall ? '1' : '0.9'}`,
                  border: `${xsmall ? '0px' : '3px solid background.paper'}`,
                  borderRadius: `${xsmall ? '0px' : '8px'}`,
                },
              }}
              fullScreen={xsmall}
              twitterProps={{
                title: shareMessage,
                hashtags: ['SkillWallet', 'DAO', 'Blockchain'],
              }}
              linkedinProps={{
                title: shareMessage,
                summary: 'Do more with DAO',
                source: 'https://skillwallet.id',
              }}
              telegramProps={{
                title: shareMessage,
              }}
              open={open}
              onClose={handleClose}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default JoinSuccess;
