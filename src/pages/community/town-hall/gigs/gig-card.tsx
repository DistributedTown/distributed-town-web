import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  ThemeOptions,
  useMediaQuery,
  Button,
  CardActions,
  Divider,
  LinearProgress,
  linearProgressClasses,
  styled,
} from '@mui/material';
import { DitoCreditsSvg, SwQuote } from 'sw-web-shared';
import { Gig } from '../../store/model';
import './gig-card.scss';
import ReadMore from './read-more';

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

function GigCard({ gig }: { gig: Gig }) {
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));
  return (
    <Card className="sw-gig-card" sx={{ bgcolor: 'text.primary', display: 'flex', flexDirection: 'column', boxShadow: 4 }}>
      <CardContent sx={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <Box>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Avatar sx={{ width: 28, height: 28 }} src={gig.image} />
            <DitoCreditsSvg width="30px" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ mt: '3px' }} lineHeight={1} variant={small ? 'body1' : 'h6'} color="primary.main">
              {gig.title}
            </Typography>
            <Typography
              minWidth="70px"
              sx={{ mt: '3px' }}
              textAlign="end"
              fontWeight="bold"
              lineHeight={1}
              variant={small ? 'body2' : 'body1'}
              color="primary.main"
            >
              {gig.credits} DITO
            </Typography>
          </div>
        </Box>
        <Box sx={{ flex: '1' }}>
          <ReadMore text={gig.description} numberOfLines={6} lineHeight={1.4} showLessButton readMoreCharacterLimit={180} />
        </Box>
        <Divider sx={{ my: 2, borderColor: 'primary.main' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="credit-label">
            <SwQuote
              mobile
              mobileStartText={
                <Typography color="primary.main" sx={{ textAlign: 'start' }} component="div" variant="body2">
                  Match your skills
                </Typography>
              }
            >
              <>
                <Typography sx={{ textAlign: 'start' }} component="div" variant="body2">
                  Match your skills
                </Typography>
              </>
            </SwQuote>
          </div>
          <div className="sw-progress-bar">
            <NoBorderLinearProgress sx={{ borderColor: 'text.primary' }} variant="determinate" value={gig.props.commitment} />
            <Typography
              className="sw-progress-bar-label"
              sx={{ color: 'text.primary', textAlign: 'center' }}
              component="span"
              variant="body2"
            >
              {gig.props.commitment}%
            </Typography>
          </div>
        </Box>
      </CardContent>
      <Divider sx={{ borderColor: 'primary.main' }} />
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button variant="outlined" size="small">
          <span style={{ marginTop: '4px' }}>Take this Gig</span>
        </Button>
      </CardActions>
    </Card>
  );
}

export default GigCard;
