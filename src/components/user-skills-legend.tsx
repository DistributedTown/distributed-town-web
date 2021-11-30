import { Box, Typography, Avatar } from '@mui/material';
import { TokenomicsSvg, SwProgressBar, NetworkDesignSvg, GameTheorySvg } from 'sw-web-shared';
import './user-skills.scss';

export const SwUserSkillsLegend = ({ user }) => {
  const Icons = {
    DeFi: NetworkDesignSvg,
    Tokenomics: TokenomicsSvg,
    GameTheory: GameTheorySvg,
  };

  return (
    <Box className="sw-user">
      <div className="sw-user-info">
        <Avatar className="sw-profile-pic" variant="square" src={user.imageUrl} sx={{ width: 86, height: 86, border: '2px solid white' }} />
        <Typography sx={{ color: 'background.paper', textAlign: 'center', margin: 1, padding: 2 }} component="div" variant="h5">
          {user.nickname}
        </Typography>
      </div>

      {user.skills.map(({ value, name }, index) => {
        const SwIcon = Icons[name] || Icons.Tokenomics;
        const percentage = +value * 10;
        return (
          <div key={index} className="sw-skills-widget">
            <div className="skill-content">
              <div className="skill-label">
                <SwIcon width="14px" />
                <Typography sx={{ color: 'background.paper', textAlign: 'start', ml: 1 }} component="div" variant="body1">
                  {name}
                </Typography>
              </div>
              <SwProgressBar percentage={percentage}> </SwProgressBar>
            </div>
          </div>
        );
      })}
    </Box>
  );
};
