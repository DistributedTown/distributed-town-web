/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { SwButton } from 'sw-web-shared';
import { useState } from 'react';
import { Typography, useTheme } from '@mui/material';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import Flipcard from '../../../../components/flip-card';
import './community-flip-card.scss';
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
    setTimeout(() => setTilted(false), 1500);
  };

  return (
    <Flipcard
      isFlipped={isFlipped}
      onClick={handleClickTilt}
      containerClassName={`${isTilted ? 'sw-card-tilt' : ''} ${closed ? 'closed' : ''}`}
    >
      <div
        className="sw-card-front"
        style={{ background: theme.palette.background.paper, boxShadow: theme.shadows[1] }}
        onClick={handleClickTilt}
      >
        <div className="sw-card-container front">
          <img className="community-logo" alt="community-logo" src={community.image} />
          <Typography
            sx={{ color: 'black', textAlign: 'center', pb: 1, mt: 1 }}
            component="div"
            variant={community.name.length > 25 ? 'h2' : 'h1'}
          >
            {community.name}
          </Typography>
          <Typography sx={{ color: 'primary.main', textAlign: 'center' }} component="div" variant="body1">
            {+community.totalMembersAllowed - +community.members}/{community.totalMembersAllowed} Spaces Available
          </Typography>
          <Typography sx={{ color: 'primary.main', textAlign: 'center' }} component="div" variant="body1">
            80% Skill Match
          </Typography>
          <Typography sx={{ color: 'primary.main', textAlign: 'center', mt: 1, fontSize: '2.5rem' }} component="div">
            {closed ? 'Closed' : 'Open'}
          </Typography>
          <Typography sx={{ color: 'primary.main', textAlign: 'center' }} component="div" variant="body1">
            Flip to read more
          </Typography>
          <div className="flip-icon-wrapper">
            <RotateRightIcon className="flip-icon" onClick={handleClickFlip} />
          </div>
        </div>
      </div>
      <div
        className="sw-card-back"
        style={{ background: theme.palette.primary.main, boxShadow: theme.shadows[1] }}
        onClick={handleClickFlip}
      >
        <div className="sw-card-container back">
          <div className="sw-community-summary-wrapper">
            <div className="sw-community-image-wrapper">
              <img className="community-logo" alt="community-logo" src={community.image} />
            </div>
            <div className="sw-community-summary">
              <Typography sx={{ color: 'background.paper', textAlign: 'center' }} component="div" variant="h4">
                {community.name}
              </Typography>
              <Typography sx={{ color: 'background.paper', textAlign: 'center' }} component="div" variant="body2">
                {+community.totalMembersAllowed - +community.members} Spaces Available
              </Typography>
              <Typography sx={{ color: 'background.paper', textAlign: 'center' }} component="div" variant="body2">
                80% Skill Match
              </Typography>
            </div>
          </div>
          <div className="sw-description-wrapper">
            <Typography sx={{ color: 'background.paper' }} component="div" variant="body1">
              {community.description}
            </Typography>
            <SwButton
              sx={{ height: '50px' }}
              color="secondary"
              onClick={(event) => {
                event.stopPropagation();
                // eslint-disable-next-line no-unused-expressions
                !closed && onSelect(community.name);
              }}
              disabled={closed}
              label="Join Community"
            />
          </div>
        </div>
      </div>
    </Flipcard>
  );
};

export default CommunityFlipCard;
