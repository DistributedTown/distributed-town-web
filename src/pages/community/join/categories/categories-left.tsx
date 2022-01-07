import { Box } from '@mui/material';
import { DitoLogoFullSvg, SwQuote } from 'sw-web-shared';

export const CategoriesLeftSide = ({ largeDevice }) => (
  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gridGap: 90 }}>
    <Box className="sw-box-logo">
      <DitoLogoFullSvg height={largeDevice ? '76px' : '80px'} />
    </Box>
    <SwQuote className="show-border">
      <>
        <p>
          Have you ever thought, <br />
          "I would like to contribute, but ..."
        </p>
        <p className="mt-4 mb-4">Distributed Town (DiTo) lets you create or join a community with one click.</p>
      </>
    </SwQuote>
  </Box>
);

export default CategoriesLeftSide;
