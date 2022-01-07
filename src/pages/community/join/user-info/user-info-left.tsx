import { Box, Typography } from '@mui/material';
import { DitoLogoSvg, SwQuote } from 'sw-web-shared';

export const UserInfoLeftSide = ({ largeDevice }) => (
  <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gridGap: 90 }}>
    <Box className="sw-box-logo" sx={{ marginTop: '75px' }}>
      <DitoLogoSvg height={largeDevice ? '76px' : '80px'} />
    </Box>
    <SwQuote className="show-border">
      <>
        <Typography sx={{ color: 'text.primary', mb: 6 }} fontWeight="bold" component="div" variant="h2" align="center">
          <p>Welcome to Distributed Town</p>
        </Typography>

        <p>
          Distributed town is a fully pseudonymous, skill-based ecosystem. <br />
        </p>
        <p className="mt-4 mb-4">
          In the next several steps you’ll be customizing your profile, picking your skills, and receiving your first Community Credits
        </p>

        <p>Have fun, and enjoy your first universal citizenship</p>
      </>
    </SwQuote>
  </Box>
);

export default UserInfoLeftSide;
