export interface Gig {
  title: string;
  description: string;
  image: string;
  props: {
    skills: {
      name: string;
      credits: string;
    }[];
    commitment: number;
    credits: number;
  };
  id: string;
  creator: string;
  taker: string;
  status: number;
  credits: number;
}
