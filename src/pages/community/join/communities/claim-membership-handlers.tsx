import { NonceActions, TextileBucketMetadata } from '@dito-api/model';
import {
  claimCommunityMembershipContract,
  executeCommunityContract,
  generateNonce,
  getTokenIdContract,
  hasPendingAuthentication,
  isQrCodeActive,
} from '@dito-api/skillwallet.api';
import { ParseSWErrorMessage } from '@dito-utils/parse-smart-contact-error';
import { Box, CircularProgress, Typography } from '@mui/material';
import { SwButton } from 'sw-web-shared';
import { QRCode } from 'react-qrcode-logo';
import { generateTextileBucketUrl } from '@dito-api/textile-bucket.api';
import { connectToEthereum, switchToEtheremNetwork } from '@dito-api/ethereum-network.api';
import { asyncPoll } from '@dito-utils/async-poller';
import { addLog } from '@dito-store/ui-reducer';
import { AppDispatch } from '@dito-store/store.model';
import { ClaimMembershipErrorTypes } from '../store/model';

const DialogLoadingMessage = ({ message, subtitle = null, onCancel }) => {
  return (
    <>
      <div className="sw-join-dialog-content">
        <CircularProgress sx={{ color: 'text.primary' }} />
        <Typography sx={{ textAlign: 'center', mt: 2 }} component="div" variant="h6">
          {message}
        </Typography>
        <Typography sx={{ color: 'text.primary', textAlign: 'center', mt: 2 }} component="div" variant="body2">
          {subtitle}
        </Typography>
      </div>
      <SwButton color="error" onClick={onCancel} sx={{ mt: 4 }} label="Cancel" />
    </>
  );
};

const DialogErrorMessage = ({ message, subtitle = null, onCancel }) => {
  return (
    <>
      <div className="sw-join-dialog-content">
        <Typography sx={{ textAlign: 'center', mt: 2 }} component="div" variant="h6">
          {message}
        </Typography>
        <Typography sx={{ color: 'text.primary', textAlign: 'center', mt: 2 }} component="div" variant="body2">
          {subtitle}
        </Typography>
      </div>
      <SwButton color="error" onClick={onCancel} sx={{ mt: 4 }} label="Cancel" />
    </>
  );
};

const DialogAdditionalActionNeeded = ({ message, subtitle, actionLabel, handleAdditionalAction, onCancel }) => {
  return (
    <>
      <div className="sw-join-dialog-content">
        <Typography sx={{ textAlign: 'center', mt: 2 }} component="div" variant="h6">
          {message}
        </Typography>
        <Typography sx={{ color: 'text.primary', textAlign: 'center', mt: 2 }} component="div" variant="body2">
          {subtitle}
        </Typography>
        <SwButton color="primary" onClick={handleAdditionalAction} sx={{ mt: 4, width: '200px', height: '45px' }} label={actionLabel} />
      </div>
      <SwButton color="error" onClick={onCancel} sx={{ mt: 4 }} label="Cancel" />
    </>
  );
};

export const OnClaimMembershipHandlers = (
  dispatch: AppDispatch,
  setDialogContent: (content: JSX.Element) => void,
  handleClose: () => void,
  handleAdditionalAction: (message: string) => void
) => {
  const onEthConnection = async () => {
    setDialogContent(<DialogLoadingMessage message="Ensuring ethereum connection ..." onCancel={handleClose} />);
    const isConnected = await connectToEthereum(dispatch);
    if (!isConnected) {
      setDialogContent(
        <>
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle="If this problem repeats plase make sure your metamask is connected"
            message="We could not enable the ethereum network"
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryNetwork)}
            onCancel={handleClose}
          />
        </>
      );
    }
    return isConnected;
  };

  const onEthNetworkChange = async (isConnected: boolean) => {
    if (!isConnected) {
      return false;
    }
    setDialogContent(<DialogLoadingMessage message="Ensuring correct network ..." onCancel={handleClose} />);
    const isCorrectNetwork = await switchToEtheremNetwork(dispatch);

    if (!isCorrectNetwork) {
      setDialogContent(
        <>
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle={null}
            message="We could not set the correct network, please set it manually and try again"
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryNetwork)}
            onCancel={handleClose}
          />
        </>
      );
    }
    return isCorrectNetwork;
  };

  const onTextileBucket = async (isCorrectNetwork: boolean, metadataJson: TextileBucketMetadata) => {
    if (!isCorrectNetwork) {
      return null;
    }
    setDialogContent(<DialogLoadingMessage message="Generating textile bucket url ..." onCancel={handleClose} />);

    try {
      return await generateTextileBucketUrl(metadataJson);
    } catch (error) {
      await dispatch(addLog(JSON.stringify(error)));
      setDialogContent(
        <>
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle={null}
            message="Unknown Error"
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryTextile)}
            onCancel={handleClose}
          />
        </>
      );
    }
    return null;
  };

  const onJoinMembership = async (buckerUrl: string, communityAddress: string, credits: string) => {
    if (!buckerUrl) {
      return null;
    }
    try {
      setDialogContent(
        <DialogLoadingMessage
          subtitle="This might take awhile, please be patient"
          message="Executing join membership smart contract ..."
          onCancel={handleClose}
        />
      );
      return await executeCommunityContract({
        url: buckerUrl,
        credits,
        communityAddress,
      });
    } catch (error) {
      await dispatch(addLog(JSON.stringify(error)));
      const message = ParseSWErrorMessage(error.data.message as string);
      // if (String(message).includes('Already a member')) {
      //   setDialogContent(
      //     <>
      //       <DialogAdditionalActionNeeded
      //         actionLabel="Connect"
      //         subtitle="Connect to SkillWallet account to see your community"
      //         message={message}
      //         handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.AlreadyMember)}
      //         onCancel={handleClose}
      //       />
      //     </>
      //   );
      // }
      if (String(message).includes('There is SkillWallet already registered for this address')) {
        setDialogContent(
          <>
            <DialogAdditionalActionNeeded
              actionLabel="Generate QR code"
              subtitle="If you have not activated you skillwallet account then you can do so by clicking generate QR Code"
              message={message}
              handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.SkillWalletNotActivated)}
              onCancel={handleClose}
            />
          </>
        );
      } else if (
        String(message).includes('There is SkillWallet to be claimed by this address') ||
        String(message).includes('Already a member')
      ) {
        setDialogContent(
          <>
            <DialogAdditionalActionNeeded
              actionLabel="Claim"
              subtitle="You are already a member of this community, but you have not claimed it yet!"
              message={message}
              handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.SkillWalletNotClaimed)}
              onCancel={handleClose}
            />
          </>
        );
      } else if (String(message).includes('No free spots left')) {
        setDialogContent(
          <>
            <DialogErrorMessage subtitle="Select another community and try again!" message={message} onCancel={handleClose} />
          </>
        );
      } else {
        setDialogContent(
          <>
            <DialogAdditionalActionNeeded
              actionLabel="Retry"
              subtitle="retry again"
              message={message}
              handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryJoin)}
              onCancel={handleClose}
            />
          </>
        );
      }

      return null;
    }
  };

  const onClaimMembership = async (communityAddress: string, hasJoinedCommunity: boolean) => {
    if (!communityAddress || !hasJoinedCommunity) {
      return null;
    }
    setDialogContent(
      <DialogLoadingMessage
        subtitle="This might take awhile, please be patient"
        message="Executing claim membership smart contract ..."
        onCancel={handleClose}
      />
    );
    try {
      return await claimCommunityMembershipContract(communityAddress);
    } catch (error) {
      await dispatch(addLog(JSON.stringify(error)));
      const message = ParseSWErrorMessage(error.data.message.payload as string);

      if (String(message).includes('There is SkillWallet already registered for this address')) {
        setDialogContent(
          <>
            <DialogAdditionalActionNeeded
              actionLabel="Connect"
              subtitle="Connect to SkillWallet account to see your community"
              message={message}
              handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.AlreadyClaimed)}
              onCancel={handleClose}
            />
          </>
        );
      } else {
        setDialogContent(
          <>
            <DialogAdditionalActionNeeded
              actionLabel="Retry"
              subtitle={null}
              message={message}
              handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryClaim)}
              onCancel={handleClose}
            />
          </>
        );
      }
      return null;
    }
  };

  const onGetTokenId = async (communityAddress: string) => {
    console.log(communityAddress, 'communityAddress');
    if (!communityAddress) {
      return null;
    }
    setDialogContent(
      <DialogLoadingMessage
        subtitle="This might take awhile, please be patient"
        message="Getting your skillwallet metadata ..."
        onCancel={handleClose}
      />
    );
    try {
      return await getTokenIdContract(communityAddress);
    } catch (error) {
      await dispatch(addLog(JSON.stringify(error)));
      // @ts-ignore
      // eslint-disable-next-line no-debugger
      debugger;
      const message = ParseSWErrorMessage(error.data.message.payload as string);
      setDialogContent(
        <>
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle={null}
            message={message}
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryTokenId)}
            onCancel={handleClose}
          />
        </>
      );
      return null;
    }
  };

  const onQRCodeGenerate = async (tokenId: string) => {
    if (!tokenId) {
      return null;
    }
    setDialogContent(
      <DialogLoadingMessage subtitle="This might take awhile, please be patient" message="Generating QR code ..." onCancel={handleClose} />
    );

    const nonce = await generateNonce(NonceActions.Activate, tokenId);

    if (!nonce) {
      setDialogContent(
        <>
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle={null}
            message="QR code was not generated successfully!"
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryNonce)}
            onCancel={handleClose}
          />
        </>
      );
    } else {
      setDialogContent(
        <>
          <Box sx={{ display: 'flex', mt: 2, p: 2, bgcolor: 'white' }}>
            <QRCode
              value={JSON.stringify({
                tokenId,
                nonce,
              })}
              logoWidth={140}
              logoHeight={140}
              bgColor="white"
              size={205}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2,
              bgcolor: 'white',
              width: '255px',
              height: '60px',
              marginTop: '14px',
            }}
          >
            <Typography sx={{ color: 'black', textAlign: 'center' }} component="div" variant="body1">
              Scan with your <b>SkillWallet App</b> <br />
              to claim your Membership
            </Typography>
          </Box>
          <SwButton color="error" onClick={handleClose} sx={{ mt: 4 }} label="Cancel" />
        </>
      );
    }

    return nonce;
  };

  const isQrCodeActivated = async (tokenId: string) => {
    if (!tokenId) {
      return false;
    }
    const fn = () => isQrCodeActive();
    const condition = (active: boolean) => !active;
    const isActive = await asyncPoll<boolean>(fn, condition, 8000, 20);

    if (!isActive) {
      setDialogContent(
        <>
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle="QR Code was not approved!"
            message="Activate your skillwallet account by using skillwallet app."
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryQrCode)}
            onCancel={handleClose}
          />
        </>
      );
    }

    return isActive;
  };

  const onAuthenticate = async (nonce: string, tokenId: string, isActive: boolean) => {
    if (!nonce || !tokenId || !isActive) {
      return false;
    }

    setDialogContent(
      <DialogLoadingMessage subtitle="This might take awhile, please be patient" message="Authenticating ...." onCancel={handleClose} />
    );

    try {
      const fn = () => hasPendingAuthentication(window.ethereum.selectedAddress);
      const condition = ({ hasPendingAuth }) => !hasPendingAuth;
      const { hasPendingAuth } = await asyncPoll<{ hasPendingAuth: boolean }>(fn, condition);
      return hasPendingAuth;
    } catch (error) {
      await dispatch(addLog(JSON.stringify(error)));
      setDialogContent(
        <>
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle="Something went wrong"
            message="Authentication was unsuccessful"
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryAuth)}
            onCancel={handleClose}
          />
        </>
      );
    }

    return false;
  };

  return {
    onEthConnection,
    onEthNetworkChange,
    onTextileBucket,
    onJoinMembership,
    onClaimMembership,
    onQRCodeGenerate,
    onAuthenticate,
    onGetTokenId,
    isQrCodeActivated,
  };
};
