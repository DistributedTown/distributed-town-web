import { ResultState } from '@dito-store/status';
import { useAppDispatch, RootState } from '@dito-store/store.model';
import { getSkillWalletDescription } from '@dito-api/skillwallet.api';
import { TextileBucketMetadata } from 'src/api/model';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, ThemeOptions, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DitoLogoSvg, SwButton } from 'sw-web-shared';

import { useWeb3React } from '@web3-react/core';
import JoinBaseLayout from '../base/join-base';
import { ClaimMembershipErrorTypes, CommunityCategory } from '../store/model';
import './communities.scss';
import { fetchCommunities, getCommunity, getCredits, getFormattedSkills, getSkillCredits, selectCommunity } from '../store/join.reducer';
import CommunityCard from './community-card';
import { OnClaimMembershipHandlers } from './claim-membership-handlers';
import { ClaimMembershipDialog } from './claim-membership-dialog';
import CommunityCredits from './community-credits';

const Communities = () => {
  const dispatch = useAppDispatch();
  const { activate } = useWeb3React();

  // responsiveness
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));
  const extraSmall = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

  // selectors
  const { isAutheticated } = useSelector((state: RootState) => state.auth);
  const { selectedCategory } = useSelector((state: RootState) => state.joinCommunity.category);
  const { selectedSkills } = useSelector((state: RootState) => state.joinCommunity.skills);
  const userInfo = useSelector((state: RootState) => state.joinCommunity.userInfo);
  const { entities, status, selectedCommunityName } = useSelector((state: RootState) => state.joinCommunity.community);
  const selectedCommunity = useSelector(getCommunity);
  const formattedSkills = useSelector(getFormattedSkills);
  const credits = useSelector(getCredits);
  const creditSkills = useSelector(getSkillCredits);

  // function/local state
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [nonce, setNonce] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setNonce(null);
    setTokenId(null);
    setDialogContent(null);
  };

  const claimMembership = async () => {
    const description = await getSkillWalletDescription();
    const metadataJson: TextileBucketMetadata = {
      name: `${userInfo?.name}'s SkillWallet`,
      description,
      image: userInfo?.avatar,
      properties: {
        username: userInfo?.name,
        skills: formattedSkills,
      },
    };
    setOpen(true);
    const {
      onEthConnection,
      onEthNetworkChange,
      onGetTokenId,
      onTextileBucket,
      onJoinMembership,
      onClaimMembership,
      onQRCodeGenerate,
      onAuthenticate,
    } = OnClaimMembershipHandlers(dispatch, setDialogContent, handleClose, async (message: ClaimMembershipErrorTypes) => {
      switch (message) {
        case ClaimMembershipErrorTypes.AlreadyMember:
          handleClose();
          break;
        case ClaimMembershipErrorTypes.SkillWalletNotActivated:
        case ClaimMembershipErrorTypes.AlreadyClaimed:
        case ClaimMembershipErrorTypes.RetryNonce:
          setTokenId(await onGetTokenId(selectedCommunity.address));
          setNonce(await onQRCodeGenerate(tokenId));
          await onAuthenticate(nonce, tokenId);
          break;
        case ClaimMembershipErrorTypes.SkillWalletNotClaimed:
        case ClaimMembershipErrorTypes.RetryClaim:
          await onClaimMembership(selectedCommunity.address, true);
          setTokenId(await onGetTokenId(selectedCommunity.address));
          console.log('TokenId: ', tokenId);
          setNonce(await onQRCodeGenerate(tokenId));
          console.log('Nonce: ', nonce);
          await onAuthenticate(nonce, tokenId);
          break;
        case ClaimMembershipErrorTypes.RetryAuth:
          await onAuthenticate(nonce, tokenId);
          break;
        case ClaimMembershipErrorTypes.RetryJoin:
        case ClaimMembershipErrorTypes.RetryNetwork:
        case ClaimMembershipErrorTypes.RetryTextile:
          setNonce(null);
          setTokenId(null);
          setDialogContent(null);
          claimMembership();
          break;
        default:
          console.error('Not handled!');
      }
    });

    /*
        Step 1 - Connect to ethereum / metamask
    */
    const isConnected = await onEthConnection(activate);
    console.log('IsConnected: ', isConnected);

    /*
        Step 2 - Change to correct ethereum network
    */
    const isCorrectNetwork = await onEthNetworkChange(isConnected);
    console.log('IsCorrectNetwork: ', isConnected);

    /*
        Step 3 - Store image & join community flow metadata to textile bucket
    */
    const bucketUrl = await onTextileBucket(isCorrectNetwork, metadataJson);
    console.log('BucketUrl: ', bucketUrl);

    /*
        Step 4 - Execute join membership smart contract
    */
    const member = await onJoinMembership(bucketUrl, selectedCommunity.address, credits);
    setTokenId(member?.tokenId);
    console.log('Member: ', member);
    console.log('TokenId: ', tokenId);

    /*
        Step 5 - Execute claim membership smart contract
    */
    await onClaimMembership(selectedCommunity.address, !!member);

    /*
        Step 6 - Generate nonce & show qr code
    */
    setNonce(await onQRCodeGenerate(tokenId));
    console.log('Nonce: ', nonce);

    /*
        Step 7 - Poll until skillwallet is authenticated
    */
    const isAuthenticated = await onAuthenticate(nonce, tokenId);
    console.log('IsAuthenticated: ', isAuthenticated);

    /*
        Step 8 - Go to success screen
    */
    // TODO: Implement success navigation
  };

  useEffect(() => {
    if (selectedSkills.length && selectedCategory) {
      dispatch(fetchCommunities(selectedCategory));
    }
  }, [dispatch, selectedCategory, selectedSkills]);

  useEffect(() => {
    if (isAutheticated) {
      handleClose();
    }
  }, [dispatch, isAutheticated]);

  return (
    <>
      <ClaimMembershipDialog fullScreen={extraSmall} open={open} onClose={() => setOpen(false)} dialogContent={dialogContent} />
      <JoinBaseLayout
        status={status}
        className="sw-communities-container"
        left={
          <>
            <Box className="sw-box-logo">
              <DitoLogoSvg width={largeDevice ? '100px' : '80px'} />
            </Box>
            <CommunityCredits totalCredits={credits} creditSkills={creditSkills} />
          </>
        }
        right={
          <div className="sw-communties-wrapper">
            <Typography sx={{ color: 'background.paper', textAlign: 'center', pb: 2 }} component="div" variant="h6">
              Here is a few comminities for you (Based on your Skills). Choose one that inspires you the most & start adding Value to it
            </Typography>
            {selectedCategory && selectedSkills.length ? (
              !entities?.length ? (
                <Typography sx={{ color: 'background.paper', textAlign: 'center', pb: 2, mt: 4 }} component="div" variant="h6">
                  We could not find any communities for {selectedCategory} category, please go back and select a different category!
                </Typography>
              ) : (
                entities.map((community: CommunityCategory, index) => (
                  <CommunityCard
                    onSelect={(name) => dispatch(selectCommunity(name))}
                    selectedCommunityName={selectedCommunityName}
                    community={community}
                    key={`community-${index}`}
                  />
                ))
              )
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
