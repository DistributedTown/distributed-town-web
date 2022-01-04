import InfoIcon from '@mui/icons-material/Info';
import { Badge, Box, ThemeOptions, Tooltip, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import { DitoLogoFullSvg, CreateUnselSvg, JoinUnselSvg, SwButton, SwDivider, SwQuote } from 'sw-web-shared';
import './get-started.scss';

const GetStarted = () => {
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));

  return (
    <div className="sw-get-started-container">
      <Box sx={{ p: 0, m: 0 }} className="sw-box">
        <Box className="sw-box-logo">
          <DitoLogoFullSvg height={largeDevice ? '76px' : '80px'} />
        </Box>

        <SwQuote>
          <>
            <p>
              <strong>Distributed Town</strong> is a new financial infrastructure for public goods, designed for the real world.
            </p>
            <p>
              It’s built upon mutual, collaborative economics between individuals and communities - and a universal identity management
              based on skills, rather than personal data.
            </p>
          </>
        </SwQuote>
      </Box>
      <SwDivider width="1px" orientation={largeDevice ? 'vertical' : 'horizontal'} />
      <Box sx={{ p: 0, m: 0 }} className="sw-box">
        <Box className="sw-box-title">
          <Typography color="info" component="div" align="center" variant="h1">
            This is <span className="underline">your Community</span>
          </Typography>
        </Box>
        <Box className="sw-box-actions">
          <SwButton label="Join" mode="light" btnType="large" endIcon={<JoinUnselSvg />} component={Link} to="/join-community/categories" />
          <Badge
            badgeContent={
              <Tooltip title="Coming soon!">
                <InfoIcon
                  sx={{
                    bgcolor: 'text.primary',
                    color: 'primary.main',
                    borderRadius: '50%',
                    fontSize: '1.2rem',
                    position: 'absolute',
                  }}
                />
              </Tooltip>
            }
          >
            <SwButton
              endIcon={<CreateUnselSvg />}
              disabled
              mode="light"
              btnType="large"
              label="Create"
              component={Link}
              to="/community/create"
            />
          </Badge>
        </Box>
      </Box>
    </div>
  );
};

export default GetStarted;
