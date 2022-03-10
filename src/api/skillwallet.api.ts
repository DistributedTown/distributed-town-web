/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { DITOCommunityABI, GigsABI, SkillWalletABI, SWContractEventType } from '@skill-wallet/sw-abi-types';
import { toWei } from 'web3-utils';
import { CommunityContract, CommunityContractError, CommunityContractResponse, NonceActions } from './model';
import { Web3ContractProvider } from './web3.provider';
import { generateTextileBucketUrl } from './textile-bucket.api';

function NoEventException(value: CommunityContractError) {
  this.value = value;
  this.message = 'No event found!';
  // eslint-disable-next-line func-names
  this.toString = function () {
    return this.value + this.message;
  };
}

export const getSkillWalletDescription = async () => {
  return 'Universal, self-sovereign IDs tied to skills & contributions rather than personal data.';
};

export const getSkillWalletAddress = async (communityAddress = null) => {
  return axios
    .get(`${process.env.REACT_APP_PUBLIC_SKILL_WALLET_API_URL}/api/skillwallet/config`)
    .then((response) => response.data.skillWalletAddress);
};

export const claimCommunityMembershipContract = async (communityAddress: string): Promise<string> => {
  console.log(communityAddress, '3212333333333332323232');
  const skillWalletAddress = await getSkillWalletAddress(communityAddress);
  const contract = await Web3ContractProvider(skillWalletAddress, SkillWalletABI);
  const claimTx = await contract.claim();
  const { events } = await claimTx.wait();
  const claimedEvent = events.find((e) => e.event === SWContractEventType.SkillWalletClaimed);

  if (!claimedEvent) {
    throw new NoEventException({
      code: -32603,
      message: 'Internal JSON-RPC error.',
      data: {
        code: 3,
        data: '',
        message: 'SkillWallet:ClaimEventMissing',
      },
    });
  }

  return claimedEvent.args;
};

export const getTokenIdContract = async (communityAddress: string): Promise<string> => {
  const skillwalletAddress = await getSkillWalletAddress(communityAddress);
  const contract = await Web3ContractProvider(skillwalletAddress, SkillWalletABI);
  const isRegistered = await contract.isSkillWalletRegistered(window.ethereum.selectedAddress);

  if (isRegistered) {
    const tokenId = await contract.getSkillWalletIdByOwner(window.ethereum.selectedAddress);
    return tokenId?.toString();
  }
  return null;
};

export const isQrCodeActive = async (): Promise<boolean> => {
  try {
    const skillwalletAddress = await getSkillWalletAddress(null);
    const contract = await Web3ContractProvider(skillwalletAddress, SkillWalletABI);
    const tokenId = await contract.getSkillWalletIdByOwner(window.ethereum.selectedAddress);
    const status = await contract.isSkillWalletActivated(tokenId);

    return status;
  } catch (error) {
    console.log('QR Code not active, error!!');
    return false;
  }
};

export const executeCommunityContract = async ({
  communityAddress,
  url,
  credits,
}: CommunityContract): Promise<CommunityContractResponse> => {
  const contract = await Web3ContractProvider(communityAddress, DITOCommunityABI);

  const createTx = await contract.joinNewMember(url, 1, toWei(credits.toString()) as unknown as number);
  const communityTransactionResult = await createTx.wait();
  const { events } = communityTransactionResult;
  const memberJoinedEvent = events.find(({ event }) => event === SWContractEventType.MemberAdded);

  if (!memberJoinedEvent) {
    throw new NoEventException({
      code: -32603,
      message: 'Internal JSON-RPC error.',
      data: {
        code: 3,
        data: '',
        message: 'SkillWallet:MemberEventMissing',
      },
    });
  }

  const [userAddress, tokenId, communityCredits] = memberJoinedEvent.args;
  return {
    userAddress,
    tokenId: tokenId?.toString(),
    credits: communityCredits,
  };
};

export const hasPendingAuthentication = async (address: string): Promise<{ hasPendingAuth: boolean }> => {
  return fetch(`${process.env.REACT_APP_PUBLIC_SKILL_WALLET_API_URL}/api/skillWallet/hasPendingAuth?address=${address}`, {
    method: 'GET',
  }).then((response) => response.json());
};

export const generateNonce = async (action: NonceActions, tokenId: string): Promise<string> => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_PUBLIC_SKILL_WALLET_API_URL}/api/skillWallet/${tokenId}/nonces?action=${action}`,
      {
        method: 'POST',
      }
    );
    const nonce = await response.json();
    return nonce.nonce;
  } catch (error) {
    return null;
  }
};

export const getCommunityInfo = async (communityAddress): Promise<any> => {
  return axios.get(`${process.env.REACT_APP_PUBLIC_API_URL}/api/community/${communityAddress}`).then((response) => response.data);
};

console.log(DITOCommunityABI);

export const takeGig = async (communityAddress: string, gigId: string) => {
  console.log('TakeGig: ', gigId);
  console.log('CommunityAddress: ', communityAddress);

  const communityContract = await Web3ContractProvider(communityAddress, DITOCommunityABI);
  const gigsAddress = await communityContract.gigsAddr();
  const gigContract = await Web3ContractProvider(gigsAddress, GigsABI);
  const tx = await gigContract.takeGig(+gigId);
  const result = await tx.wait();
  const { events } = result;
  const event = events.find((e) => e.event === SWContractEventType.GigTaken);
  if (!event) {
    throw new NoEventException({
      code: -32603,
      message: 'Internal JSON-RPC error.',
      data: {
        code: 3,
        data: '',
        message: 'DistributedTown:GigTakenEventMissing',
      },
    });
  }
  return event.args;
};

export const createGig = async (communityAddress: string, metadata: any) => {
  console.log('metadata: ', metadata);
  console.log('CreateGigCommunityAddress: ', communityAddress);

  const { credits, ...rest } = metadata;

  const url = await generateTextileBucketUrl(rest);
  const communityContract = await Web3ContractProvider(communityAddress, DITOCommunityABI);
  const gigsAddress = await communityContract.gigsAddr();
  const gigContract = await Web3ContractProvider(gigsAddress, GigsABI);
  const tx = await gigContract.createGig(+credits, url);

  const result = await tx.wait();
  const { events } = result;
  const event = events.find((e) => e.event === SWContractEventType.GigCreated);
  if (!event) {
    throw new NoEventException({
      code: -32603,
      message: 'Internal JSON-RPC error.',
      data: {
        code: 3,
        data: '',
        message: 'DistributedTown:GigCreatedEventMissing',
      },
    });
  }
  return event.args;
};
