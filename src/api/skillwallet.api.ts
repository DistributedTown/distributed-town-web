/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from 'ethers';
import { communityAbi, skillWalletAbi } from 'src/abis/abis';
import { toWei } from 'web3-utils';
import axios from 'axios';
import { CommunityContract, CommunityContractError, CommunityContractResponse, NonceActions } from './model';

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
  return '0x1e79bE396CE37F7eB43aF0Ef0ffb3124F3fD23eF';
};

export const claimCommunityMembershipContract = async (communityAddress: string): Promise<string> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const skillWalletAddress = await getSkillWalletAddress(communityAddress);
  const contract = new ethers.Contract(skillWalletAddress, skillWalletAbi, signer);
  const claimTx = await contract.claim();
  const claimTransactionResult = await claimTx.wait();
  const { events } = claimTransactionResult;
  const claimedEvent = events.find((e) => e.event === 'SkillWalletClaimed');

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
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const skillwalletAddress = await getSkillWalletAddress(communityAddress);
  const contract = new ethers.Contract(skillwalletAddress, skillWalletAbi, signer);
  const isRegistered = await contract.isSkillWalletRegistered(window.ethereum.selectedAddress);

  console.log('isRegistered: ', isRegistered);

  if (isRegistered) {
    const tokenId = await contract.getSkillWalletIdByOwner(window.ethereum.selectedAddress);
    return tokenId?.toString();
  }
  return null;
};

export const executeCommunityContract = async ({
  communityAddress,
  url,
  credits,
}: CommunityContract): Promise<CommunityContractResponse> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(communityAddress, communityAbi, signer);
  const createTx = await contract.joinNewMember(url, toWei(credits.toString()));
  const communityTransactionResult = await createTx.wait();
  const { events } = communityTransactionResult;
  const memberJoinedEvent = events.find(({ event }) => event === 'MemberAdded');

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
