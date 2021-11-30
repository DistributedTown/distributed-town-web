import { Avatar, Badge, Tooltip, Typography, useTheme } from '@mui/material';
import { SwQuote, DitoCreditsSvg, SwProgressBar } from 'sw-web-shared';
import HelpIcon from '@mui/icons-material/Help';
import './community-credits.scss';
import { useSelector } from 'react-redux';
import { toPascalCase } from '@dito-utils/pascal-case';
import { RootState } from '@dito-store/store.model';
import { getCredits, getSkillCredits } from '../store/join.reducer';
import { CategoryIcons } from '../categories/categories';

function CommunityCredits() {
  const totalCredits = useSelector(getCredits);
  const creditSkills = useSelector(getSkillCredits) as any;
  const theme = useTheme();
  const userInfo = useSelector((state: RootState) => state.joinCommunity.userInfo);
  return (
    <SwQuote showBorder={false} className="sw-credits">
      <>
        <div className="sw-user-info">
          <Avatar
            className="sw-profile-pic"
            variant="square"
            src={userInfo?.avatar}
            sx={{ width: 110, height: 110, border: '2px solid white' }}
          />
          <Typography sx={{ color: 'background.paper', textAlign: 'center', my: 2 }} component="div" variant="h1">
            {userInfo?.name}
          </Typography>
        </div>
        <div className="sw-total-credits">
          <Badge
            badgeContent={
              <Tooltip title={<>{Number(totalCredits) - 2000} (skill credits) + 2000 (base credits)</>} arrow>
                <HelpIcon
                  sx={{
                    borderRadius: '50%',
                    fontSize: '1.2rem',
                  }}
                />
              </Tooltip>
            }
          >
            <Typography sx={{ color: 'text.primary', textAlign: 'center', mb: 2 }} component="div" variant="subtitle1">
              Total credits: {totalCredits}
            </Typography>
          </Badge>
        </div>
        {creditSkills.map(({ percentage, name, credits }, index) => {
          const SwIcon = CategoryIcons[toPascalCase(name)];
          return (
            <div key={index} className="sw-credit-widget">
              <div className="credit-content">
                <div className="credit-label">
                  {SwIcon === undefined ? <div className="sw-credit-icon" /> : <SwIcon className="sw-credit-icon" height="18px" />}
                  <Typography sx={{ color: 'text.primary', textAlign: 'start', ml: 1 }} component="div" variant="h3">
                    {name}
                  </Typography>
                </div>
                <SwProgressBar percentage={percentage}> </SwProgressBar>
              </div>
              <div className="credit-amount">
                <Typography sx={{ color: 'text.primary', textAlign: 'start', mr: 1 }} component="div" variant="h3">
                  {credits}
                </Typography>
                <DitoCreditsSvg sx={{ fill: theme.palette.text.primary }} width="26px" />
              </div>
            </div>
          );
        })}
      </>
    </SwQuote>
  );
}

export default CommunityCredits;
