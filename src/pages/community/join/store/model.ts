/* eslint-disable no-shadow */

export enum JoinSkillWalletErrors {
  NoFreeSpots = 'NoFreeSpots',
  AlreadyMember = 'AlreadyMember',
  SkillWalletNotActivated = 'SkillWalletNotActivated',
  SkillWalletNotClaimed = 'SkillWalletNotClaimed',
  Retry = 'Retry',
}

export enum EhereumNetworkErrors {
  Retry = 'Retry',
}

export enum TextileStorageErrors {
  Retry = 'Retry',
}

export enum SkillWalletNonceErrors {
  Retry = 'Retry',
}

export enum ClaimSkillWalletErrors {
  AlreadyClaimed = 'AlreadyClaimed',
  SkillWalletNotCreated = 'SkillWalletNotCreated',
  Retry = 'Retry',
}

export enum SkillWalletAuthenticationErrors {
  Retry = 'Retry',
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
