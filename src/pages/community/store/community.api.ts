import axios from 'axios';
import { Gig } from './model';

export const getGigs = async (communityAddress: string): Promise<Gig[]> => {
  return axios.get(`${process.env.REACT_APP_PUBLIC_API_URL}/api/community/${communityAddress}/gigs`, {}).then((res) => res.data?.gigs);
};
