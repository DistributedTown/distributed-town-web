export type SWEvent = {
  event: SWContractEventType;
  args: any;
}[];

export interface SWContractFunctions {
  addPubKeyToSkillWallet: (skillWalletId: number, pubKey: string) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  approve: (to: string, tokenId: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  balanceOf: (member: string) => Promise<number>;
  baseURI: () => Promise<string>;
  claim: () => Promise<{ wait: () => Promise<SWContractEvents> }>;
  create: (skillWalletOwner: string, url: string, isClaimable: boolean) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  getActiveCommunity: (skillWalletId: number) => Promise<{ community: string }>;
  getApproved: (tokenId: number) => Promise<string>;
  getClaimableSkillWalletId: (skillWalletOwner: string) => Promise<number>;
  getCommunityHistory: (skillWalletId: number) => Promise<{ communities: string[] }>;
  getSkillWalletIdByOwner: (skillWalletOwner: string) => Promise<number>;
  getTotalSkillWalletsRegistered: () => Promise<number>;
  isApprovedForAll: (owner: string, operator: string) => Promise<boolean>;
  isRequestIdValid: (requestId: string) => Promise<boolean>;
  isSkillWalletActivated: (skillWalletId: number) => Promise<{ status: boolean }>;
  isSkillWalletClaimable: (skillWalletOwner: string) => Promise<{ status: boolean }>;
  isSkillWalletRegistered: (skillWalletOwner: string) => Promise<{ status: boolean }>;
  onERC721Received: (operator: string, from: string, tokenId: number, data: string) => Promise<undefined>;
  owner: () => Promise<string>;
  ownerOf: (tokenId: number) => Promise<string>;
  renounceOwnership: () => Promise<{ wait: () => Promise<SWContractEvents> }>;
  safeTransferFrom: (from: string, to: string, tokenId: number, _data: string) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  setApprovalForAll: (operator: string, approved: boolean) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  skillWalletClaimers: () => Promise<number>;
  skillWalletToPubKey: () => Promise<string>;
  supportsInterface: (interfaceId: string) => Promise<boolean>;
  symbol: () => Promise<string>;
  tokenByIndex: (index: number) => Promise<number>;
  tokenOfOwnerByIndex: (owner: string, index: number) => Promise<number>;
  tokenURI: (tokenId: number) => Promise<string>;
  totalSupply: () => Promise<number>;
  transferFrom: (from: string, to: string, tokenId: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  transferOwnership: (newOwner: string) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  validate: (
    signature: string,
    tokenId: number,
    action: number,
    stringParams: string[],
    intParams: number[],
    addressParams: string[]
  ) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  validationCallback: (_requestId: string, _isValid: boolean) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  activeMembersCount: () => Promise<undefined>;
  addProjectId: (projectId: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  ditoCreditsAddr: () => Promise<string>;
  ditoCreditsHolder: () => Promise<string>;
  getMemberAddresses: () => Promise<string[]>;
  getMembers: () => Promise<number[]>;
  getProjectTreasuryAddress: (projectId: number) => Promise<string>;
  getProjects: () => Promise<number[]>;
  getSkillWalletAddress: () => Promise<string>;
  getTemplate: () => Promise<number>;
  getTokenId: () => Promise<number>;
  getTreasuryBalance: () => Promise<number>;
  gigsAddr: () => Promise<string>;
  isMember: () => Promise<boolean>;
  join: (skillWalletTokenId: number, credits: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  joinNewMember: (uri: string, credits: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  leave: (memberAddress: string) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  memberAddresses: () => Promise<string>;
  metadataUri: () => Promise<string>;
  scarcityScore: () => Promise<number>;
  skillWalletIds: () => Promise<number>;
  tokenId: () => Promise<number>;
  transferCredits: (to: string, amount: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  transferToCommunity: (from: string, amount: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;
  treasuryAddr: () => Promise<string>;
}
export interface SWContractEvents {
  events: SWEvent;
}

// eslint-disable-next-line no-shadow
export const enum SWContractEventType {
  Approval = 'Approval',
  ApprovalForAll = 'ApprovalForAll',
  ChainlinkCancelled = 'ChainlinkCancelled',
  ChainlinkFulfilled = 'ChainlinkFulfilled',
  ChainlinkRequested = 'ChainlinkRequested',
  OwnershipTransferred = 'OwnershipTransferred',
  PubKeyAddedToSkillWallet = 'PubKeyAddedToSkillWallet',
  SkillWalletActivated = 'SkillWalletActivated',
  SkillWalletClaimed = 'SkillWalletClaimed',
  SkillWalletCommunityChanged = 'SkillWalletCommunityChanged',
  SkillWalletCreated = 'SkillWalletCreated',
  Transfer = 'Transfer',
  ValidationFailed = 'ValidationFailed',
  ValidationPassed = 'ValidationPassed',
  ValidationRequestIdSent = 'ValidationRequestIdSent',
  MemberAdded = 'MemberAdded',
  MemberLeft = 'MemberLeft',
}

declare module 'ethers' {
  export class Contract extends BaseContract implements SWContractFunctions {
    addPubKeyToSkillWallet: (skillWalletId: number, pubKey: string) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    approve: (to: string, tokenId: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    balanceOf: (member: string) => Promise<number>;

    baseURI: () => Promise<string>;

    claim: () => Promise<{ wait: () => Promise<SWContractEvents> }>;

    create: (skillWalletOwner: string, url: string, isClaimable: boolean) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    getActiveCommunity: (skillWalletId: number) => Promise<{ community: string }>;

    getApproved: (tokenId: number) => Promise<string>;

    getClaimableSkillWalletId: (skillWalletOwner: string) => Promise<number>;

    getCommunityHistory: (skillWalletId: number) => Promise<{ communities: string[] }>;

    getSkillWalletIdByOwner: (skillWalletOwner: string) => Promise<number>;

    getTotalSkillWalletsRegistered: () => Promise<number>;

    isApprovedForAll: (owner: string, operator: string) => Promise<boolean>;

    isRequestIdValid: (requestId: string) => Promise<boolean>;

    isSkillWalletActivated: (skillWalletId: number) => Promise<{ status: boolean }>;

    isSkillWalletClaimable: (skillWalletOwner: string) => Promise<{ status: boolean }>;

    isSkillWalletRegistered: (skillWalletOwner: string) => Promise<{ status: boolean }>;

    onERC721Received: (operator: string, from: string, tokenId: number, data: string) => Promise<undefined>;

    owner: () => Promise<string>;

    ownerOf: (tokenId: number) => Promise<string>;

    renounceOwnership: () => Promise<{ wait: () => Promise<SWContractEvents> }>;

    safeTransferFrom: (from: string, to: string, tokenId: number, _data: string) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    setApprovalForAll: (operator: string, approved: boolean) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    skillWalletClaimers: () => Promise<number>;

    skillWalletToPubKey: () => Promise<string>;

    supportsInterface: (interfaceId: string) => Promise<boolean>;

    symbol: () => Promise<string>;

    tokenByIndex: (index: number) => Promise<number>;

    tokenOfOwnerByIndex: (owner: string, index: number) => Promise<number>;

    tokenURI: (tokenId: number) => Promise<string>;

    totalSupply: () => Promise<number>;

    transferFrom: (from: string, to: string, tokenId: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    transferOwnership: (newOwner: string) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    validate: (
      signature: string,
      tokenId: number,
      action: number,
      stringParams: string[],
      intParams: number[],
      addressParams: string[]
    ) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    validationCallback: (_requestId: string, _isValid: boolean) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    activeMembersCount: () => Promise<undefined>;

    addProjectId: (projectId: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    ditoCreditsAddr: () => Promise<string>;

    ditoCreditsHolder: () => Promise<string>;

    getMemberAddresses: () => Promise<string[]>;

    getMembers: () => Promise<number[]>;

    getProjectTreasuryAddress: (projectId: number) => Promise<string>;

    getProjects: () => Promise<number[]>;

    getSkillWalletAddress: () => Promise<string>;

    getTemplate: () => Promise<number>;

    getTokenId: () => Promise<number>;

    getTreasuryBalance: () => Promise<number>;

    gigsAddr: () => Promise<string>;

    isMember: () => Promise<boolean>;

    join: (skillWalletTokenId: number, credits: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    joinNewMember: (uri: string, credits: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    leave: (memberAddress: string) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    memberAddresses: () => Promise<string>;

    metadataUri: () => Promise<string>;

    scarcityScore: () => Promise<number>;

    skillWalletIds: () => Promise<number>;

    tokenId: () => Promise<number>;

    transferCredits: (to: string, amount: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    transferToCommunity: (from: string, amount: number) => Promise<{ wait: () => Promise<SWContractEvents> }>;

    treasuryAddr: () => Promise<string>;

    // The meta-class properties
    // @ts-ignore
    readonly [key: string]: ContractFunction | any;
  }
}
