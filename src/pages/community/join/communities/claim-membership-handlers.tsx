import { NonceActions, TextileBucketMetadata } from '@dito-api/model';
import {
  claimCommunityMembershipContract,
  executeCommunityContract,
  generateNonce,
  getTokenIdContract,
  hasPendingAuthentication,
  isQrCodeActive,
} from '@dito-api/skillwallet.api';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography } from '@mui/material';
import { SwButton, ParseSWErrorMessage, asyncPoll, DitoLogoSvg } from 'sw-web-shared';
import { QRCode } from 'react-qrcode-logo';
import { generateTextileBucketUrl } from '@dito-api/textile-bucket.api';
import { connectToEthereum, switchToEtheremNetwork } from '@dito-api/ethereum-network.api';
import { addLog } from '@dito-store/ui-reducer';
import { AppDispatch } from '@dito-store/store.model';
import { ClaimMembershipErrorTypes } from '../store/model';
import './communities.scss';

const DialogLoadingMessage = ({ message, subtitle = null, onCancel }) => {
  return (
    <>
      <div className="sw-join-dialog-content">
        <CloseIcon onClick={onCancel} sx={{ position: 'absolute', cursor: 'pointer', top: 8, right: 8 }} />
        <DitoLogoSvg width="220" height="220" className="dialog-loading-logo" />
        <div style={{ minHeight: '150px', display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ textAlign: 'center', mt: 8 }} component="div" variant="h1">
            {message}
          </Typography>
          <Typography sx={{ color: 'text.primary', textAlign: 'center', mt: 2 }} component="div" variant="h4">
            {subtitle}
          </Typography>
        </div>
      </div>
    </>
  );
};

const DialogErrorMessage = ({ message, subtitle = null, onCancel }) => {
  return (
    <>
      <div className="sw-join-dialog-content">
        <CloseIcon onClick={onCancel} sx={{ position: 'absolute', cursor: 'pointer', top: 8, right: 8 }} />
        <Typography sx={{ textAlign: 'center', mt: 2 }} component="div" variant="h1">
          {message}
        </Typography>
        <Typography sx={{ color: 'text.primary', textAlign: 'center', mt: 2 }} component="div" variant="h4">
          {subtitle}
        </Typography>
      </div>
    </>
  );
};

const DialogAdditionalActionNeeded = ({ message, subtitle, actionLabel, handleAdditionalAction, onCancel }) => {
  return (
    <>
      <div className="sw-join-dialog-content">
        <CloseIcon onClick={onCancel} sx={{ position: 'absolute', cursor: 'pointer', top: 8, right: 8 }} />
        <Typography sx={{ textAlign: 'center', mt: 2 }} component="div" variant="h1">
          {message}
        </Typography>
        <Typography sx={{ color: 'text.primary', textAlign: 'center', mt: 2 }} component="div" variant="h4">
          {subtitle}
        </Typography>
        <SwButton color="primary" onClick={handleAdditionalAction} sx={{ mt: 4, width: '200px', height: '45px' }} label={actionLabel} />
      </div>
    </>
  );
};

const qrLogo =
  // eslint-disable-next-line max-len
  'data:image/png;base64,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';

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
        <DialogAdditionalActionNeeded
          actionLabel="Retry"
          subtitle="If this problem repeats plase make sure your metamask is connected"
          message="We could not enable the ethereum network"
          handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryNetwork)}
          onCancel={handleClose}
        />
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
        <DialogAdditionalActionNeeded
          actionLabel="Retry"
          subtitle={null}
          message="We could not set the correct network, please set it manually and try again"
          handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryNetwork)}
          onCancel={handleClose}
        />
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
        <DialogAdditionalActionNeeded
          actionLabel="Retry"
          subtitle={null}
          message="Unknown Error"
          handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryTextile)}
          onCancel={handleClose}
        />
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
          <DialogAdditionalActionNeeded
            actionLabel="Generate QR code"
            subtitle="If you have not activated you skillwallet account then you can do so by clicking generate QR Code"
            message={message}
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.SkillWalletNotActivated)}
            onCancel={handleClose}
          />
        );
      } else if (
        String(message).includes('There is SkillWallet to be claimed by this address') ||
        String(message).includes('Already a member')
      ) {
        setDialogContent(
          <DialogAdditionalActionNeeded
            actionLabel="Claim"
            subtitle="You are already a member of this community, but you have not claimed it yet!"
            message={message}
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.SkillWalletNotClaimed)}
            onCancel={handleClose}
          />
        );
      } else if (String(message).includes('No free spots left')) {
        setDialogContent(
          <DialogErrorMessage subtitle="Select another community and try again!" message={message} onCancel={handleClose} />
        );
      } else {
        setDialogContent(
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle="retry again"
            message={message}
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryJoin)}
            onCancel={handleClose}
          />
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
          <DialogAdditionalActionNeeded
            actionLabel="Connect"
            subtitle="Connect to SkillWallet account to see your community"
            message={message}
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.AlreadyClaimed)}
            onCancel={handleClose}
          />
        );
      } else {
        setDialogContent(
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle={null}
            message={message}
            handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryClaim)}
            onCancel={handleClose}
          />
        );
      }
      return null;
    }
  };

  const onGetTokenId = async (communityAddress: string) => {
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
      const message = ParseSWErrorMessage(error.data.message.payload as string);
      setDialogContent(
        <DialogAdditionalActionNeeded
          actionLabel="Retry"
          subtitle={null}
          message={message}
          handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryTokenId)}
          onCancel={handleClose}
        />
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
        <DialogAdditionalActionNeeded
          actionLabel="Retry"
          subtitle={null}
          message="QR code was not generated successfully!"
          handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryNonce)}
          onCancel={handleClose}
        />
      );
    } else {
      setDialogContent(
        <>
          <CloseIcon onClick={handleClose} sx={{ position: 'absolute', cursor: 'pointer', top: 8, right: 8 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2,
              width: '380px',
              marginTop: '14px',
            }}
          >
            <Typography sx={{ textAlign: 'center', width: '100%' }} component="div" variant="h1">
              Scan the QR Code
            </Typography>
            <Typography sx={{ textAlign: 'center', mt: 2, width: '100%' }} component="div" variant="h4">
              Scan with your SkillWallet App <br />
              to Claim your Membership!
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <QRCode
              value={JSON.stringify({
                tokenId,
                nonce,
              })}
              bgColor="transparent"
              fgColor="white"
              logoImage={qrLogo}
              logoWidth={70}
              logoHeight={70}
              size={215}
            />
          </Box>
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
        <DialogAdditionalActionNeeded
          actionLabel="Retry"
          subtitle="QR Code was not approved!"
          message="Activate your skillwallet account by using skillwallet app."
          handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryQrCode)}
          onCancel={handleClose}
        />
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
        <DialogAdditionalActionNeeded
          actionLabel="Retry"
          subtitle="Something went wrong"
          message="Authentication was unsuccessful"
          handleAdditionalAction={() => handleAdditionalAction(ClaimMembershipErrorTypes.RetryAuth)}
          onCancel={handleClose}
        />
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
