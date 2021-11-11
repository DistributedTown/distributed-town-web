/* eslint-disable no-shadow */

export enum ClaimMembershipErrorTypes {
  NoFreeSpots = 'NoFreeSpots',
  AlreadyMember = 'AlreadyMember',
  SkillWalletNotActivated = 'SkillWalletNotActivated',
  SkillWalletNotClaimed = 'SkillWalletNotClaimed',
  RetryJoin = 'RetryJoin',
  RetryNetwork = 'RetryNetwork',
  RetryTextile = 'RetryTextile',
  RetryNonce = 'RetryNonce',
  AlreadyClaimed = 'AlreadyClaimed',
  SkillWalletNotCreated = 'SkillWalletNotCreated',
  RetryClaim = 'RetryClaim',
  RetryAuth = 'RetryAuth',
  RetryTokenId = 'RetryTokenId',
  RetryQrCode = 'RetryQrCode',
}

export interface Category {
  id: number;
  name: string;
  icon?: any;
}

export interface SkillCategory {
  credits: number;
  skills: string[];
  subCat: string;
}

export interface CommunityCategory {
  name: string;
  members: number;
  scarcityScore: number;
  address: string;
  description: string;
  totalMembersAllowed: number;
  image: string;
}
