import { Typography, Avatar, Badge, Tooltip, useTheme } from '@mui/material';
import { CategoryIcons } from 'src/pages/community/join/categories/categories';
import { SwProgressBar, DitoCreditsNewSvg, toPascalCase } from 'sw-web-shared';
import InfoIcon from '@mui/icons-material/Info';
import './user-skills.scss';

export const SwUserSkillsLegend = ({ username, avatar, creditSkills, totalCredits, showCreditAmount = false }) => {
  const theme = useTheme();

  return (
    <div className="sw-user-info-wrapper">
      <div className="sw-user-info">
        <Avatar className="sw-profile-pic" variant="square" src={avatar} sx={{ width: 110, height: 110, border: '2px solid white' }} />
        <Typography sx={{ color: 'background.paper', textAlign: 'center', my: 2 }} component="div" variant="h1">
          {username}
        </Typography>
      </div>
      <div className="sw-total-credits">
        <Badge
          badgeContent={
            <Tooltip title={<>{Number(totalCredits) - 2000} (skill credits) + 2000 (base credits)</>}>
              <InfoIcon
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
      {creditSkills.map(({ value, name, credits }, index) => {
        const SwIcon = CategoryIcons[toPascalCase(name)];
        return (
          <div key={index} className="sw-credit-widget">
            <div className="credit-label">
              {SwIcon === undefined ? <div className="sw-credit-icon" /> : <SwIcon className="sw-credit-icon" height="16px" />}
              <Typography sx={{ color: 'text.primary', textAlign: 'start' }} component="div" variant="h3">
                {name}
              </Typography>
            </div>
            <div className="credit-content">
              <SwProgressBar percentage={value}> </SwProgressBar>
              {showCreditAmount && (
                <div className="credit-amount">
                  <Typography sx={{ color: 'text.primary', textAlign: 'start', mr: 1 }} component="div" variant="h3">
                    {credits}
                  </Typography>
                  <DitoCreditsNewSvg sx={{ fill: theme.palette.text.primary }} width="26px" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
