import { Badge, Box, ThemeOptions, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { SwQuote, DitoCreditsSvg, TokenomicsSvg, SwProgressBar } from 'sw-web-shared';
import HelpIcon from '@mui/icons-material/Help';
import './community-credits.scss';

// const NoBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
//   height: '15px',
//   borderRadius: 0,
//   border: `1px solid ${theme.palette.background.paper}`,
//   [`&.${linearProgressClasses.colorPrimary}`]: {
//     backgroundColor: theme.palette.background.paper,
//   },
//   [`& .${linearProgressClasses.bar}`]: {
//     borderRadius: 0,
//     backgroundColor: theme.palette.primary.main,
//   },
// }));

function CommunityCredits({ totalCredits, creditSkills }) {
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));
  return (
    <Box className="sw-community-credits">
      <Typography sx={{ color: 'text.primary', textAlign: 'center', mb: 2 }} component="div" variant="h6">
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
            <Typography sx={{ color: 'text.primary', textAlign: 'start', mb: 2 }} component="div" variant="h6">
              Total credits: {totalCredits}
            </Typography>
          </Badge>
          {creditSkills.map(({ percentage, name, credits }, index) => {
            return (
              <div key={index} className="sw-credit-widget">
                <div className="credit-content">
                  <div className="credit-label">
                    <TokenomicsSvg width="14px" />
                    <Typography sx={{ color: 'text.primary', textAlign: 'start', ml: 1 }} component="div" variant="body2">
                      {name}
                    </Typography>
                  </div>
                  <SwProgressBar percentage={percentage}> </SwProgressBar>
                </div>
                <div className="credit-amount">
                  <Typography sx={{ color: 'text.primary', textAlign: 'start', mr: 1 }} component="div" variant="body2">
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
