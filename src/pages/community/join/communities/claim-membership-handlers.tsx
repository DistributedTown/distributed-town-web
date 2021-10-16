import { NonceActions, TextileBucketMetadata } from '@dito-api/model';
import { claimCommunityMembershipContract, executeCommunityContract, generateNonce } from '@dito-api/skillwallet.api';
import { ParseSWErrorMessage } from '@dito-utils/parse-smart-contact-error';
import { Box, CircularProgress, Typography } from '@mui/material';
import { SwButton } from 'sw-web-shared';
import { QRCode } from 'react-qrcode-logo';
import { generateTextileBucketUrl } from '@dito-api/textile-bucket.api';
import { connectToEthereum, switchToEtheremNetwork } from '@dito-api/ethereum-network.api';
import { JoinSkillWalletErrors } from '../store/model';

const DialogLoadingMessage = ({ message, subtitle = null, onCancel }) => {
  return (
    <>
      <div className="sw-join-dialog-content">
        <CircularProgress sx={{ color: 'text.primary' }} />
        <Typography sx={{ textAlign: 'center', mt: 2 }} component="div" variant="h6">
          {message}
        </Typography>
        <Typography sx={{ color: 'secondary.main', textAlign: 'center', mt: 2 }} component="div" variant="body2">
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
        <Typography sx={{ color: 'secondary.main', textAlign: 'center', mt: 2 }} component="div" variant="body2">
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
        <Typography sx={{ color: 'secondary.main', textAlign: 'center', mt: 2 }} component="div" variant="body2">
          {subtitle}
        </Typography>
        <SwButton color="primary" onClick={handleAdditionalAction} sx={{ mt: 4, width: '200px', height: '45px' }} label={actionLabel} />
      </div>
      <SwButton color="error" onClick={onCancel} sx={{ mt: 4 }} label="Cancel" />
    </>
  );
};

export const OnClaimMembershipHandlers = (
  setDialogContent: (content: JSX.Element) => void,
  handleClose: () => void,
  handleAdditionalAction: (message: string) => void
) => {
  const onEthConnection = async () => {
    setDialogContent(<DialogLoadingMessage message="Ensuring ethereum connection ..." onCancel={handleClose} />);
    const isConnected = await connectToEthereum();
    if (!isConnected) {
      setDialogContent(
        <>
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle="If this problem repeats plase make sure your metamask is connected"
            message="We could not enable the ethereum network"
            handleAdditionalAction={() => handleAdditionalAction(JoinSkillWalletErrors.Retry)}
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
    const isCorrectNetwork = await switchToEtheremNetwork();

    if (!isCorrectNetwork) {
      setDialogContent(
        <DialogErrorMessage message="We could not set the correct network, please set it manually and try again" onCancel={handleClose} />
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
      setDialogContent(
        <>
          <DialogAdditionalActionNeeded
            actionLabel="Retry"
            subtitle={null}
            message="Unknown Error"
            handleAdditionalAction={() => handleAdditionalAction(JoinSkillWalletErrors.Retry)}
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
      const message = ParseSWErrorMessage(error.data.message as string);
      // const message = 'There is SkillWallet to be claimed by this address';

      if (String(message) === String('Already a member')) {
        setDialogContent(
          <>
            <DialogAdditionalActionNeeded
              actionLabel="Connect"
              subtitle="Connect to SkillWallet account to see your community"
              message={message}
              handleAdditionalAction={() => handleAdditionalAction(JoinSkillWalletErrors.AlreadyMember)}
              onCancel={handleClose}
            />
          </>
        );
      } else if (String(message) === String('There is SkillWallet already registered for this address')) {
        setDialogContent(
          <>
            <DialogAdditionalActionNeeded
              actionLabel="Generate QR code"
              subtitle="If you have not activated you skillwallet account then you can do so by clicking generate QR Code"
              message={message}
              handleAdditionalAction={() => handleAdditionalAction(JoinSkillWalletErrors.SkillWalletNotActivated)}
              onCancel={handleClose}
            />
          </>
        );
      } else if (String(message) === String('There is SkillWallet to be claimed by this address')) {
        setDialogContent(
          <>
            <DialogAdditionalActionNeeded
              actionLabel="Claim"
              subtitle="You are already a member of this community, but you have not claimed it yet!"
              message={message}
              handleAdditionalAction={() => handleAdditionalAction(JoinSkillWalletErrors.SkillWalletNotClaimed)}
              onCancel={handleClose}
            />
          </>
        );
      } else if (String(message) === String('No free spots left')) {
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
              handleAdditionalAction={() => handleAdditionalAction(JoinSkillWalletErrors.Retry)}
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
      const message = ParseSWErrorMessage(error.data.message.payload as string);

      if (String(message) === String('There is SkillWallet already registered for this address')) {
        setDialogContent(
          <>
            <DialogAdditionalActionNeeded
              actionLabel="Connect"
              subtitle="Connect to SkillWallet account to see your community"
              message={message}
              handleAdditionalAction={() => handleAdditionalAction(JoinSkillWalletErrors.AlreadyMember)}
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
              handleAdditionalAction={() => handleAdditionalAction(JoinSkillWalletErrors.Retry)}
              onCancel={handleClose}
            />
          </>
        );
      }
      return null;
    }
  };

  const onQRCodeGenerate = async (generatedTokenId: string) => {
    if (!generatedTokenId) {
      return null;
    }
    setDialogContent(
      <DialogLoadingMessage subtitle="This might take awhile, please be patient" message="Generating QR code ..." onCancel={handleClose} />
    );

    const generatedNonce = await generateNonce(NonceActions.Activate, generatedTokenId);

    if (!generatedNonce) {
      setDialogContent(<DialogErrorMessage message="QR code was not generated successfully!" onCancel={handleClose} />);
    } else {
      setDialogContent(
        <>
          <Box sx={{ display: 'flex', mt: 2, p: 2, bgcolor: 'white' }}>
            <QRCode
              value={JSON.stringify({
                tokenId: generatedTokenId,
                nonce: generatedNonce,
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
              width: '230px',
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

    return generatedNonce;
  };

  return {
    onEthConnection,
    onEthNetworkChange,
    onTextileBucket,
    onJoinMembership,
    onClaimMembership,
    onQRCodeGenerate,
  };
};
