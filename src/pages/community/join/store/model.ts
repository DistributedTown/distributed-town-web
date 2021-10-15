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
}
