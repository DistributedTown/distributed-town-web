import { Box } from '@mui/material';
import { DitoLogoSvg, SwQuote } from 'sw-web-shared';
import CommunityCredits from '../communities/community-credits';

export const SkillsLeftSide = ({ largeDevice }) => (
  <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box className="sw-box-logo" sx={{ marginTop: '75px' }}>
      <DitoLogoSvg height={largeDevice ? '76px' : '80px'} />
    </Box>
    <CommunityCredits />
  </Box>
);

export default SkillsLeftSide;
