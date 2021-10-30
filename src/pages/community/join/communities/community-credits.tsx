import { Badge, Box, styled, ThemeOptions, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { SwQuote, TokenomicsSvg, DitoCreditsSvg } from 'sw-web-shared';
import HelpIcon from '@mui/icons-material/Help';
import './community-credits.scss';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const NoBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '15px',
  borderRadius: 0,
  border: `1px solid ${theme.palette.background.paper}`,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.background.paper,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
  },
}));

function CommunityCredits({ totalCredits, creditSkills }) {
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));
  return (
    <Box className="sw-community-credits">
      <Typography sx={{ color: 'background.paper', textAlign: 'center', mb: 2 }} component="div" variant="h6">
        DITO credits you will earn with your skills
      </Typography>
      <SwQuote mobile={small} mobileStartText={<p>Credits...</p>}>
        <>
          <Badge
            sx={{ paddingLeft: '15px' }}
            badgeContent={
              <Tooltip title={<>{Number(totalCredits) - 2000} (skill credits) + 2000 (base credits)</>} arrow>
                <HelpIcon
                  sx={{
                    borderRadius: '50%',
                    fontSize: '1.2rem',
                    position: 'absolute',
                  }}
                />
              </Tooltip>
            }
          >
            <Typography sx={{ color: 'background.paper', textAlign: 'start', mb: 2 }} component="div" variant="h6">
              Total credits: {totalCredits}
            </Typography>
          </Badge>
          {creditSkills.map(({ percentage, name, credits }, index) => {
            return (
              <div key={index} className="sw-credit-widget">
                <div className="credit-content">
                  <div className="credit-label">
                    <TokenomicsSvg width="14px" />
                    <Typography sx={{ color: 'background.paper', textAlign: 'start', ml: 1 }} component="div" variant="body2">
                      {name}
                    </Typography>
                  </div>
                  <div className="sw-progress-bar">
                    <NoBorderLinearProgress variant="determinate" value={percentage} />
                    <Typography
                      className="sw-progress-bar-label"
                      sx={{ color: 'secondary.main', textAlign: 'center' }}
                      component="span"
                      variant="body2"
                    >
                      {percentage}%
                    </Typography>
                  </div>
                </div>
                <div className="credit-amount">
                  <Typography sx={{ color: 'background.paper', textAlign: 'start', mr: 1 }} component="div" variant="body2">
                    {credits}
                  </Typography>
                  <DitoCreditsSvg width="14px" />
                </div>
              </div>
            );
          })}
        </>
      </SwQuote>
    </Box>
  );
}

export default CommunityCredits;
