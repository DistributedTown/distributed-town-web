/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
import { useAppDispatch, RootState } from '@dito-store/store.model';
import { getSkillWalletDescription } from '@dito-api/skillwallet.api';
import { TextileBucketMetadata } from 'src/api/model';
import { CircularProgress, ThemeOptions, Typography } from '@mui/material';
import { CardCarousel } from '@dito-components/card-carousel';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setAuthenticated } from '@dito-auth/auth.reducer';
import { ResultState } from '@dito-store/status';
import { ClaimMembershipErrorTypes } from '../store/model';
import './communities.scss';
import {
  fetchCommunities,
  getCommunity,
  getCredits,
  getFormattedSkills,
  getSkillCredits,
  selectCommunity,
  setCurrentStep,
} from '../store/join.reducer';
import { OnClaimMembershipHandlers } from './claim-membership-handlers';
import { ClaimMembershipDialog } from './claim-membership-dialog';
import CommunityFlipCard from './community-flip-card';

const Communities = (props) => {
  const dispatch = useAppDispatch();

  const extraSmall = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

  // selectors
  const { activeStep } = useSelector((state: RootState) => state.joinCommunity.currentStep);
  const { isAutheticated } = useSelector((state: RootState) => state.auth);
  const { selectedCategory } = useSelector((state: RootState) => state.joinCommunity.category);
  const { selectedSkills } = useSelector((state: RootState) => state.joinCommunity.skills);
  const userInfo = useSelector((state: RootState) => state.joinCommunity.userInfo);
  const { entities, status } = useSelector((state: RootState) => state.joinCommunity.community);
  const selectedCommunity = useSelector(getCommunity);
  const formattedSkills = useSelector(getFormattedSkills);
  const credits = useSelector(getCredits);
  const creditSkills = useSelector(getSkillCredits);

  // function/local state
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setDialogContent(null);
  };

  const claimMembership = async (communityName) => {
    await dispatch(selectCommunity(communityName));
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
    const goToSuccessScreen = (authenticated: boolean) => {
      if (!authenticated) {
        return;
      }
      dispatch(
        setAuthenticated({
          isAuthenticated: true,
          userInfo,
        })
      );
      props.history.push(`/community/success?communityAddress=${selectedCommunity.address}&diToCredits=${credits}`);
    };
    const {
      onEthConnection,
      onEthNetworkChange,
      onGetTokenId,
      onTextileBucket,
      onJoinMembership,
      onClaimMembership,
      onQRCodeGenerate,
      isQrCodeActivated,
    } = OnClaimMembershipHandlers(dispatch, setDialogContent, handleClose, async (message: ClaimMembershipErrorTypes) => {
      let tokenId = null;
      let nonce = null;
      let active = false;
      switch (message) {
        case ClaimMembershipErrorTypes.AlreadyMember:
          handleClose();
          break;
        case ClaimMembershipErrorTypes.SkillWalletNotActivated:
        case ClaimMembershipErrorTypes.AlreadyClaimed:
        case ClaimMembershipErrorTypes.RetryNonce:
          /*
              Step 1 - get tokenId from skillwallet
          */
          tokenId = await onGetTokenId(selectedCommunity.address);
          console.log('TokenId: ', tokenId);

          /*
              Step 2 - generate qr code nonce
          */
          nonce = await onQRCodeGenerate(tokenId);

          /*
              Step 3 - poll to check if qr code was used/activate
          */
          active = await isQrCodeActivated(tokenId);
          console.log('IsQrCodeActivated: ', active);

          /*
              Step 5 - Go to success screen
          */
          goToSuccessScreen(active);
          break;
        case ClaimMembershipErrorTypes.SkillWalletNotClaimed:
        case ClaimMembershipErrorTypes.RetryClaim:
          /*
              Step 1 - Execute claim membership smart contract
          */
          await onClaimMembership(selectedCommunity.address, true);

          /*
              Step 2 - get tokenId from skillwallet
          */
          tokenId = await onGetTokenId(selectedCommunity.address);
          console.log('TokenId: ', tokenId);

          /*
              Step 3 - generate qr code nonce
          */
          nonce = await onQRCodeGenerate(tokenId);
          console.log('Nonce: ', nonce);

          /*
              Step 4 - poll to check if qr code was used/activate
          */
          active = await isQrCodeActivated(tokenId);
          console.log('IsQrCodeActivated: ', active);

          /*
              Step 5 - Go to success screen
          */
          goToSuccessScreen(active);
          break;
        case ClaimMembershipErrorTypes.RetryQrCode:
          /*
             Step 1 - get tokenId from skillwallet
         */
          tokenId = await onGetTokenId(selectedCommunity.address);
          console.log('TokenId: ', tokenId);
          /*
            Step 2 - generate qr code nonce
          */
          nonce = await onQRCodeGenerate(tokenId);
          console.log('Nonce: ', nonce);

          /*
              Step 3 - poll to check if qr code was used/activate
          */
          active = await isQrCodeActivated(tokenId);
          console.log('IsQrCodeActivated: ', active);

          /*
              Step 4 - Go to success screen
          */
          goToSuccessScreen(active);
          break;
        // case ClaimMembershipErrorTypes.RetryAuth:
        //   isAuthenticated = await onAuthenticate(nonce, tokenId, active);
        //   console.log('IsAuthenticated: ', isAuthenticated);
        //   break;
        case ClaimMembershipErrorTypes.RetryJoin:
        case ClaimMembershipErrorTypes.RetryNetwork:
        case ClaimMembershipErrorTypes.RetryTextile:
          setDialogContent(null);
          // claimMembership();
          break;
        default:
          console.error('Not handled!');
      }
    });

    /*
        Step 1 - Connect to ethereum / metamask
    */
    const isConnected = await onEthConnection();
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
    const tokenId = member?.tokenId;
    console.log('Member: ', member);
    console.log('TokenId: ', tokenId);

    /*
        Step 5 - Execute claim membership smart contract
    */
    await onClaimMembership(selectedCommunity.address, !!member);

    /*
        Step 6 - Generate nonce & show qr code
    */
    const nonce = await onQRCodeGenerate(tokenId);
    console.log('Nonce: ', nonce);

    /*
        Step 7 - poll to check if qr code was used/activate
    */
    const active = await isQrCodeActivated(tokenId);
    console.log('IsQrCodeActivated: ', active);

    /*
        Step 8 - Go to success screen
    */
    goToSuccessScreen(active);
  };

  const flipcards = () => {
    const fakeEntities = [
      ...entities,
      {
        name: 'Test Closed Community',
        address: '0xC643138abBcb8396718D7040859fee7905c65B05',
        description:
          'For researchers & web3, open-source teams, that innovate in a liberal fashion - for a more sustainable, meritocratic world.',
        template: 'Open-Source & DeFi',
        image: 'https://hub.textile.io/ipfs/bafkreiaks3kjggtxqaj3ixk6ce2difaxj5r6lbemx5kcqdkdtub5vwv5mi',
        isDiToNativeCommunity: false,
        members: 24,
        totalMembersAllowed: 24,
      },
    ];
    return fakeEntities?.map((c) => {
      return (
        <div style={{ height: '350px', width: '330px', marginTop: '10px', marginBottom: '10px' }}>
          <CommunityFlipCard community={c} onSelect={claimMembership} />
        </div>
      );
    });
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

  useEffect(() => {
    let interval = null;
    if (status === ResultState.Idle) {
      interval = setInterval(() => {
        const slides = document.querySelectorAll('.slider-single');

        [...(slides as unknown as any[])].forEach((el: HTMLElement) => {
          const cardFront = el.querySelector('.sw-card-front');
          if (!cardFront) {
            return;
          }
          if (el.classList.contains('active') && !cardFront.classList.contains('closed') && !cardFront.classList.contains('flipped')) {
            cardFront.classList.add('sw-card-tilt');

            setTimeout(() => {
              cardFront.classList.remove('sw-card-tilt');
            }, 1500);
          } else {
            cardFront.classList.remove('sw-card-tilt');
          }
        });
      }, 8000);
    }

    return () => interval && clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (activeStep !== 2) {
      dispatch(
        setCurrentStep({
          activeStep: 2,
          stepperText: 'Welcome to Distributed Town',
          title: 'Step 3 - Pick your Community',
          // eslint-disable-next-line max-len
          description: `Here's a few communities for you (based on your skills). Choose one that inspires you the most & start adding Value to it`,
          toPrevBtnPath: '/join-community/skills',
          left: null,
        })
      );
    }
  }, [dispatch, credits, creditSkills, activeStep]);

  return (
    <>
      {status === ResultState.Loading ? (
        <CircularProgress sx={{ color: 'text.primary', mt: 2 }} />
      ) : (
        <>
          <ClaimMembershipDialog fullScreen={extraSmall} open={open} onClose={() => setOpen(false)} dialogContent={dialogContent} />
          <div className="sw-communties-wrapper">
            {selectedCategory && selectedSkills.length ? (
              !entities?.length ? (
                <Typography sx={{ color: 'text.primary', textAlign: 'center', pb: 2, mt: 4 }} component="div" variant="h6">
                  We could not find any communities for {selectedCategory} category, please go back and select a different category!
                </Typography>
              ) : (
                <CardCarousel slides={flipcards()} />
              )
            ) : (
              // entities.map((community: CommunityCategory, index) => (
              //   <CommunityCard
              //     onSelect={(name) => dispatch(selectCommunity(name))}
              //     selectedCommunityName={selectedCommunityName}
              //     community={community}
              //     key={`community-${index}`}
              //   />
              // )

              <Typography
                className="no-item-selected"
                sx={{ color: 'text.primary', textAlign: 'center', pb: 2 }}
                component="div"
                variant="body2"
              >
                No skills were selected, go back and select some skills before selecting a community
              </Typography>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Communities;
