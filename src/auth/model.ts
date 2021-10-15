export interface TextileBucketSkillsMetadata {
  name: string; // skillname
  value: number; // xp
}

export interface TextileBucketMetadata {
  name: string;
  description: string;
  image: null;
  properties: {
    username: string;
    skills: TextileBucketSkillsMetadata[];
  };
}

export interface CommunityContract {
  communityAddress: string;
  url: string;
  credits: string;
}

export interface CommunityContractError {
  code: number;
  message: string;
  data: {
    code: number;
    data: any;
    message: string;
  };
}

export interface CommunityContractResponse {
  userAddress: string;
  tokenId: string;
  credits: number;
}
