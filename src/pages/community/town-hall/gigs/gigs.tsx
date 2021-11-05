import { ThemeOptions, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import './gigs.scss';

const Gigs = () => {
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));

  return (
    <div className="sw-gigs-container">
      <Typography
        color="background.paper"
        sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        variant="h3"
      >
        Comming soon!
      </Typography>
    </div>
  );
};

export default Gigs;
