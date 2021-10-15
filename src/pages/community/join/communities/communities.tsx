import { ResultState } from '@dito-store/status';
import { RootState, useAppDispatch } from '@dito-store/store';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, CircularProgress, Dialog, DialogContent, ThemeOptions, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DitoLogoFullSvg, SwButton, SwQuote } from 'sw-web-shared';
import {
  claimCommunityMembership,
  ensureEtheruemIsConnected,
  ensureEtheruemNetworkIsCorrect,
  getOrCreateTextileBucket,
  joinCommunityMembership,
} from '../../../../auth/auth.reducer';

import JoinBaseLayoyt from '../base/join-base';
import { fetchCommunities, selectCommunity } from '../store/join.reducer';
import { CommunityCategory } from '../store/model';
import './communities.scss';
import CommunityCard from './community-card';
import { mockCommunity, metadataJson } from './mock-data';

const LoadingDialog = ({ open, handleClose, dialogContent }: any) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent
        sx={{ width: '400px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
      >
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

const DialogLoadingMessage = ({ message, subtitle = null, onCancel }) => {
  return (
    <>
      <CircularProgress />
      <Typography sx={{ color: 'black', textAlign: 'center', mt: 2 }} component="div" variant="h6">
        {message}
      </Typography>
      <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }} component="div" variant="body2">
        {subtitle}
      </Typography>
      <SwButton color="error" onClick={onCancel} sx={{ mt: 4 }} label="Cancel" />
    </>
  );
};

const DialogErrorMessage = ({ message, onCancel }) => {
  return (
    <>
      <Typography sx={{ color: 'black', textAlign: 'center', mt: 2 }} component="div" variant="h6">
        {message}
        <SwButton color="error" onClick={onCancel} sx={{ mt: 4 }} label="Cancel" />
      </Typography>
    </>
  );
};

const Communities = () => {
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));

  const dispatch = useAppDispatch();
  const { entities, status, selectedCommunity, communitySelectedCategory } = useSelector(
    (state: RootState) => state.joinCommunity.community
  );
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const { selectedCategory } = useSelector((state: RootState) => state.joinCommunity.category);

  const handleClose = () => setOpen(false);

  const handleEthConnection = async () => {
    setDialogContent(<DialogLoadingMessage message="Ensuring ethereum connection ..." onCancel={handleClose} />);
    const connection = await dispatch(ensureEtheruemIsConnected());
    const isConnected = connection.payload as boolean;
    if (!isConnected) {
      setDialogContent(<DialogErrorMessage message="We could not connect to ethereum network, please try again!" onCancel={handleClose} />);
    }
    return isConnected;
  };

  const handleEthNetwork = async (isConnected: boolean) => {
    if (!isConnected) {
      return false;
    }
    setDialogContent(<DialogLoadingMessage message="Ensuring correct network ..." onCancel={handleClose} />);
    const network = await dispatch(ensureEtheruemNetworkIsCorrect());
    const isCorrectNetwork = network.payload as boolean;

    if (!isCorrectNetwork) {
      setDialogContent(
        <DialogErrorMessage message="We could not set the correct network, please set it manually and try again" onCancel={handleClose} />
      );
    }
    return isCorrectNetwork;
  };

  const handleTextileBucket = async (isCorrectNetwork: boolean) => {
    if (!isCorrectNetwork) {
      return null;
    }
    setDialogContent(<DialogLoadingMessage message="Generating textile bucket url ..." onCancel={handleClose} />);
    const textile = await dispatch(getOrCreateTextileBucket(metadataJson as any));

    if (textile.meta.requestStatus === 'fulfilled') {
      return textile.payload as string;
    }

    setDialogContent(<DialogErrorMessage message={textile.payload} onCancel={handleClose} />);
    return null;
  };

  const handleJoinMembership = async (buckerUrl: string) => {
    if (!buckerUrl) {
      return null;
    }
    setDialogContent(
      <DialogLoadingMessage
        subtitle="This might take awhile, please be patient"
        message="Executing join membership smart contract ..."
        onCancel={handleClose}
      />
    );
    const skillwalletJoin = await dispatch(
      joinCommunityMembership({
        url: buckerUrl,
        credits: '2222',
        communityAddress: mockCommunity.address,
      })
    );

    if (skillwalletJoin.meta.requestStatus === 'fulfilled') {
      return skillwalletJoin.payload as any;
    }

    setDialogContent(<DialogErrorMessage message={skillwalletJoin.payload} onCancel={handleClose} />);
    return null;
  };

  const handleClaimMembership = async (communityAddress: string, member: any) => {
    if (!communityAddress || !member) {
      return null;
    }
    setDialogContent(
      <DialogLoadingMessage
        subtitle="This might take awhile, please be patient"
        message="Executing claim membership smart contract ..."
        onCancel={handleClose}
      />
    );
    const skillwalletClaim = await dispatch(claimCommunityMembership(mockCommunity.address));

    if (skillwalletClaim.meta.requestStatus === 'fulfilled') {
      return skillwalletClaim.payload as any;
    }

    setDialogContent(<DialogErrorMessage message={skillwalletClaim.payload} onCancel={handleClose} />);
    return null;
  };

  const claimMembership = async () => {
    setOpen(true);
    const isConnected = await handleEthConnection();
    const isCorrectNetwork = await handleEthNetwork(isConnected);
    const bucketUrl = await handleTextileBucket(isCorrectNetwork);
    const member = await handleJoinMembership(bucketUrl);

    console.log(member, 'member');
    await handleClaimMembership(mockCommunity.address, member);
  };

  useEffect(() => {
    // don't fetch again when the selected category is same as before
    // this is for cases where we go back and forth on the steps
    if (!selectedCategory || selectedCategory !== communitySelectedCategory) {
      dispatch(fetchCommunities(selectedCategory));
    }
  }, [dispatch, communitySelectedCategory, selectedCategory]);

  return (
    <>
      <LoadingDialog open={open} onClose={handleClose} dialogContent={dialogContent} />
      <JoinBaseLayoyt
        status={status}
        className="sw-communities-container"
        left={
          <>
            <Box className="sw-box-logo">
              <DitoLogoFullSvg width={largeDevice ? '280px' : '200px'} />
            </Box>
            <SwQuote mobile={small} mobileStartText={<p>Have you ever thought...</p>}>
              <>
                <p>
                  Have you ever thought, <br />
                  "I would like to contribute, but ..."
                </p>
                <p className="mt-4 mb-4">Distributed Town (DiTo) lets you create or join a community with one click.</p>

                <p>Just select what you are best at - and we will match with the best communities that need you the most.</p>
              </>
            </SwQuote>
          </>
        }
        right={
          <div className="sw-communties-wrapper">
            <Typography sx={{ color: 'background.paper', textAlign: 'center', pb: 2 }} component="div" variant="h6">
              Here is a few comminities for you (Based on your Skills). Choose one that inspires you the most & start adding Value to it
            </Typography>
            {entities.map((community: CommunityCategory, index) => (
              <CommunityCard
                inactive={index === 1}
                onSelect={(name) => dispatch(selectCommunity(name))}
                selectedCommunity={selectedCommunity}
                community={community}
                key={`community-${index}`}
              />
            ))}
          </div>
        }
        prevBtn={<SwButton startIcon={<NavigateBeforeIcon />} component={Link} to="/join-community/skills" label="Prev" />}
        nextBtn={
          <SwButton
            disabled={selectedCommunity === null || status === ResultState.Loading}
            endIcon={<NavigateNextIcon />}
            onClick={() => claimMembership()}
            to="/join-community/Community"
            label={small ? 'Next' : 'Next: Claim your membership'}
          />
        }
      />
    </>
  );
};

export default Communities;
