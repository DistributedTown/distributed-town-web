import { ResultState } from '@dito-store/status';
import { RootState, useAppDispatch } from '@dito-store/store';
import { asyncPoll } from '@dito-utils/async-poller';
import { hasPendingAuthentication } from '@dito-api/skillwallet.api';
import { TextileBucketMetadata } from 'src/api/model';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, ThemeOptions, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DitoLogoFullSvg, SwButton, SwQuote } from 'sw-web-shared';

import JoinBaseLayoyt from '../base/join-base';
import { ClaimSkillWalletErrors, CommunityCategory, JoinSkillWalletErrors } from '../store/model';
import './communities.scss';
import { fetchCommunities, getCommunity, getCredits, getFormattedSkills, selectCommunity } from '../store/join.reducer';
import CommunityCard from './community-card';
import { OnClaimMembershipHandlers } from './claim-membership-handlers';
import { ClaimMembershipDialog } from './claim-membership-dialog';

const hardcodedTokenId = '2456546';

const Communities = () => {
  const dispatch = useAppDispatch();

  // responsiveness
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));
  const extraSmall = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

  // selectors
  const { selectedCategory } = useSelector((state: RootState) => state.joinCommunity.category);
  const { selectedSkills } = useSelector((state: RootState) => state.joinCommunity.skills);
  const { entities, status, selectedCommunityName, communitySelectedCategory } = useSelector(
    (state: RootState) => state.joinCommunity.community
  );
  const selectedCommunity = useSelector(getCommunity);
  const formattedSkills = useSelector(getFormattedSkills);
  const credits = useSelector(getCredits);

  // function/local state
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [nonce, setNonce] = useState(null);

  const onAuthenticate = async () => {
    if (!nonce || !tokenId) {
      return;
    }
    const fn = () => hasPendingAuthentication(window.ethereum.selectedAddress);
    const condition = ({ hasPendingAuth }) => !hasPendingAuth && !!open;
    const { hasPendingAuth } = await asyncPoll<{ hasPendingAuth: boolean }>(fn, condition);
    console.log('hasPendingAuth: ', hasPendingAuth);
  };

  const handleClose = () => {
    setOpen(false);
    setNonce(null);
    setTokenId(null);
    setDialogContent(null);
  };

  const claimMembership = async () => {
    const username = 'Tao';
    const metadataJson: TextileBucketMetadata = {
      name: `${username}'s SkillWallet`,
      description: 'Universal, self-sovereign IDs tied to skills & contributions rather than personal data.',
      image: null,
      properties: {
        username,
        skills: formattedSkills,
      },
    };
    setOpen(true);
    const { onEthConnection, onEthNetworkChange, onTextileBucket, onJoinMembership, onClaimMembership, onQRCodeGenerate } =
      OnClaimMembershipHandlers(
        setDialogContent,
        () => handleClose(),
        async (message: string) => {
          if (JoinSkillWalletErrors.AlreadyMember === message) {
            // call connect once implemented in skillwallet auth the ability to call connect programatically
            handleClose();
          } else if (JoinSkillWalletErrors.SkillWalletNotActivated === message) {
            const generatedNonce = await onQRCodeGenerate(hardcodedTokenId);
            setNonce(generatedNonce);
            await onAuthenticate();
          } else if (JoinSkillWalletErrors.SkillWalletNotClaimed === message) {
            const hasJoinedCommunity = true;
            await onClaimMembership(selectedCommunity.address, hasJoinedCommunity);
            // TODO: get token id from api once implemented in https://dito-labs.atlassian.net/browse/DITO-129
            // setTokenId(member?.tokenId);
            const generatedNonce = await onQRCodeGenerate(hardcodedTokenId);
            setNonce(generatedNonce);
            await onAuthenticate();
          } else if (JoinSkillWalletErrors.Retry === message || ClaimSkillWalletErrors.Retry === message) {
            setNonce(null);
            setTokenId(null);
            setDialogContent(null);
            claimMembership();
          }
        }
      );

    console.log(credits, 'credits');
    const isConnected = await onEthConnection();
    console.log('isConnected: ', isConnected);
    const isCorrectNetwork = await onEthNetworkChange(isConnected);
    console.log('isCorrectNetwork: ', isConnected);
    const bucketUrl = await onTextileBucket(isCorrectNetwork, metadataJson);
    console.log('bucketUrl: ', bucketUrl);
    const member = await onJoinMembership(bucketUrl, selectedCommunity.address, credits);
    console.log('member: ', member);
    await onClaimMembership(selectedCommunity.address, !!member);
    setTokenId(member?.tokenId);
    const generatedNonce = await onQRCodeGenerate(tokenId);
    setNonce(generatedNonce);
    await onAuthenticate();
  };

  useEffect(() => {
    if (selectedSkills.length && selectedCategory && selectedCategory !== communitySelectedCategory) {
      dispatch(fetchCommunities(selectedCategory));
    }
  }, [dispatch, communitySelectedCategory, selectedCategory, selectedSkills]);

  return (
    <>
      <ClaimMembershipDialog fullScreen={extraSmall} open={open} onClose={() => setOpen(false)} dialogContent={dialogContent} />
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
            {selectedCategory && selectedSkills.length ? (
              entities.map((community: CommunityCategory, index) => (
                <CommunityCard
                  inactive={index === 1}
                  onSelect={(name) => dispatch(selectCommunity(name))}
                  selectedCommunityName={selectedCommunityName}
                  community={community}
                  key={`community-${index}`}
                />
              ))
            ) : (
              <Typography
                className="no-item-selected"
                sx={{ color: 'background.paper', textAlign: 'center', pb: 2 }}
                component="div"
                variant="h6"
              >
                No skills were selected, go back and select some skills before selecting a community
              </Typography>
            )}
          </div>
        }
        prevBtn={<SwButton startIcon={<NavigateBeforeIcon />} component={Link} to="/join-community/skills" label="Prev" />}
        nextBtn={
          <SwButton
            disabled={selectedCommunityName === null || status === ResultState.Loading}
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
