import axios from 'axios';
import { Category, CommunityCategory, SkillCategory } from './model';

export const getCategories = async (): Promise<Category[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 0,
          name: 'Management',
          icon: 'Management',
        },
        {
          id: 1,
          name: 'Network Design',
          icon: 'Network',
        },
        {
          id: 2,
          name: 'Training & Sport',
          icon: 'TrainSport',
        },
        {
          id: 3,
          name: 'Web Dev',
          icon: 'WebDev',
        },
        {
          id: 4,
          name: 'DeFi',
          icon: 'Defi',
        },
        {
          id: 5,
          name: 'Tokenomics',
          icon: 'Tokenomics',
        },
        {
          id: 6,
          name: 'Painting',
          icon: 'Painting',
        },
        {
          id: 7,
          name: 'Consensus',
          icon: 'Consensus',
        },
        {
          id: 8,
          name: 'Photography',
          icon: 'Photography',
        },
        {
          id: 9,
          name: 'Community',
          icon: 'Community',
        },
        {
          id: 10,
          name: 'Governance',
          icon: 'Governance',
        },
        {
          id: 11,
          name: 'Teaching',
          icon: 'Teaching',
        },
        {
          id: 12,
          name: 'Architecture',
          icon: 'Architecture',
        },
        {
          id: 13,
          name: 'Frontend Dev',
          icon: 'Frontend',
        },
        {
          id: 14,
          name: 'Gardening',
          icon: 'Gardening',
        },

        {
          id: 15,
          name: 'Mobile Dev',
          icon: 'Mobile',
        },
        {
          id: 16,
          name: 'Video-Making',
          icon: 'Video',
        },
        {
          id: 17,
          name: 'Legal',
          icon: 'Legal',
        },
        {
          id: 18,
          name: 'Smart Contracts',
          icon: 'SmartContracts',
        },
        {
          id: 19,
          name: 'Game Theory',
          icon: 'GameTheory',
        },
        {
          id: 20,
          name: 'Householding',
          icon: 'HouseHolding',
        },
        {
          id: 21,
          name: 'Backend',
          icon: 'Backend',
        },
        {
          id: 22,
          name: 'Blockchain',
          icon: 'Blockchain',
        },
      ]);
    }, 2000);
  });

export const getSkills = async (categoryId: string): Promise<SkillCategory[]> => {
  return axios
    .get(`${process.env.REACT_APP_PUBLIC_API_URL}/api/skill?skill=${encodeURIComponent(categoryId)}`)
    .then((res) => res.data)
    .then(({ categories }) => categories)
    .catch(() => []);
};

export const getCommunties = async (categoryId: string): Promise<CommunityCategory[]> => {
  return axios
    .get(`${process.env.REACT_APP_PUBLIC_API_URL}/api/community?category=${encodeURIComponent(categoryId)}`)
    .then((res) => res.data);
};
