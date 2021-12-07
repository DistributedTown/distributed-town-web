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

  const theme = useTheme();
  const closed = community.members >= community.totalMembersAllowed;

  const handleClickFlip = (event) => {
    event.stopPropagation();
    setFlipped(!isFlipped);
  };
  const returnNull = () => {
    return null;
  };

  return (
    <Flipcard
      isFlipped={isFlipped}
      onClick={closed ? returnNull : handleClickFlip}
      containerClassName={`${isFlipped ? 'flipped' : ''} ${closed ? 'closed' : ''}`}
    >
      <div
        className={`sw-card-front ${isFlipped ? 'flipped' : ''} ${closed ? 'closed' : ''}`}
        style={{ background: theme.palette.background.paper, boxShadow: theme.shadows[1] }}
        onClick={closed ? returnNull : handleClickFlip}
      >
        <div className={`sw-card-container front${closed ? ' closed' : ''}`}>
          <img className="community-logo" alt="community-logo" src={community.image} />
          <Typography
            sx={{ color: 'black', textAlign: 'center', pb: 1, mt: 1 }}
            component="div"
            variant={community.name.length > 25 ? 'h2' : 'h1'}
          >
            {community.name}
          </Typography>
          <Typography sx={{ color: 'primary.main', textAlign: 'center' }} component="div" variant="body2">
            {+community.totalMembersAllowed - +community.members}/{community.totalMembersAllowed} Spaces Available
          </Typography>
          <Typography sx={{ color: 'primary.main', textAlign: 'center' }} component="div" variant="body2">
            80% Skill Match
          </Typography>
          <Typography sx={{ color: 'primary.main', textAlign: 'center', mt: 1 }} variant="xl" component="div">
            {closed ? 'Closed' : 'Open'}
          </Typography>
          {!closed && (
            <>
              <Typography sx={{ color: 'primary.main', textAlign: 'center' }} component="div" variant="body2">
                Click to read more
              </Typography>
              <div className="flip-icon-wrapper">
                <RotateRightIcon className="flip-icon" />
              </div>
            </>
          )}
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
              <img className="community-logo-small" alt="community-logo" src={community.image} />
            </div>
            <div className="sw-community-summary">
              <Typography sx={{ color: 'background.paper', textAlign: 'left' }} component="div" variant="h3">
                {community.name}
              </Typography>
              <Typography sx={{ color: 'background.paper', textAlign: 'left' }} component="div" variant="body2">
                {+community.totalMembersAllowed - +community.members} Spaces Available
              </Typography>
              <Typography sx={{ color: 'background.paper', textAlign: 'left' }} component="div" variant="body2">
                80% Skill Match
              </Typography>
            </div>
          </div>
          <div className="sw-description-wrapper">
            <Typography sx={{ color: 'background.paper' }} component="div" variant="body2">
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
