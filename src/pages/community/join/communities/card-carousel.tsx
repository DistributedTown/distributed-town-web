import { RootState, useAppDispatch } from '@dito-store/store.model';
import { useSelector } from 'react-redux';
import { selectCommunity } from '../store/join.reducer';
import CommunityFlipCard from './flip-card-example';

const community = {
  name: 'Open-Source & DeFi',
  members: 1,
  scarcityScore: 0,
  address: '0xCBD8DA830262a287d73fF3eF07b0A0b350453C00',
  description:
    'For researchers & web3, open-source teams, that innovate in a liberal fashion - for a more sustainable, meritocratic world.',
  image: 'https://hub.textile.io/ipfs/bafkreiaks3kjggtxqaj3ixk6ce2difaxj5r6lbemx5kcqdkdtub5vwv5mi',
  totalMembersAllowed: 24,
};

const CardCarousel = () => {
  const dispatch = useAppDispatch();
  const { selectedCommunityName } = useSelector((state: RootState) => state.joinCommunity.community);

  return (
    <div style={{ height: '350px', width: '330px' }}>
      <CommunityFlipCard
        community={community}
        onSelect={(name) => dispatch(selectCommunity(name))}
        selectedCommunityName={selectedCommunityName}
      />
    </div>
  );
};

export default CardCarousel;
