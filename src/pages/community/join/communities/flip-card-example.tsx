import { Button, Icon, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import Flipcard from '../../../../components/flip-card';
import './flip-card.scss';
import { CommunityCategory } from '../store/model';

const CommunityFlipCard = ({
  community,
  selectedCommunityName,
  onSelect,
}: {
  community: CommunityCategory;
  selectedCommunityName: string;
  onSelect: (communityName: string) => any;
}) => {
  const [isFlipped, setFlipped] = useState(false);
  const [isTilted, setTilted] = useState(false);

  const theme = useTheme();
  const closed = community.members >= community.totalMembersAllowed;

  const handleClickFlip = (event) => {
    event.stopPropagation();
    setFlipped(!isFlipped);
  };

  const handleClickTilt = () => {
    setTilted(true);
    setTimeout(() => setTilted(false), 1250);
  };

  return (
    <Flipcard
      isFlipped={isFlipped}
      onClick={handleClickTilt}
      containerClassName={`${isTilted ? 'sw-card-tilt' : ''} ${closed ? 'closed' : ''}`}
    >
      <div className="sw-card-front" style={{ background: theme.palette.background.paper, boxShadow: theme.shadows[1] }}>
        <div className="sw-card-container">
          <img className="community-logo" alt="community-logo" src={community.image} />
          <Typography sx={{ color: 'black', textAlign: 'center', pb: 2, mt: 2 }} component="div" variant="h5">
            {community.name}
          </Typography>
          <Typography sx={{ color: 'black', textAlign: 'center' }} component="div" variant="body2">
            {+community.totalMembersAllowed - +community.members}/{community.totalMembersAllowed} Spaces Available
          </Typography>
          <Typography sx={{ color: 'black', textAlign: 'center' }} component="div" variant="body2">
            80% Skill Match
          </Typography>
          <Typography sx={{ color: 'black', textAlign: 'center', mb: 1, mt: 2 }} component="div" variant="h3">
            {closed ? 'Closed' : 'Open'}
          </Typography>
          <Typography sx={{ color: 'black', textAlign: 'center' }} component="div" variant="body2">
            Flip to read more
          </Typography>
          <div className="flip-icon-wrapper">
            <RotateRightIcon className="flip-icon" onClick={handleClickFlip} />
          </div>
        </div>
      </div>

      <div className="sw-card-back" style={{ background: theme.palette.primary.main, boxShadow: theme.shadows[1] }}>
        <div className="sw-card-container">
          <img className="community-logo" alt="community-logo" src={community.image} />
          <div className="flip-icon-wrapper">
            <RotateRightIcon className="flip-icon" onClick={handleClickFlip} />
          </div>
        </div>
      </div>
    </Flipcard>
  );
};

export default CommunityFlipCard;
