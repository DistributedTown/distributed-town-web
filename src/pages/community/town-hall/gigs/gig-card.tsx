/* eslint-disable max-len */
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
import { DitoCreditsSvg, SwButton, SwQuote } from 'sw-web-shared';
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

function GigCard({ gig, onSelect }: { gig: Gig; onSelect: (gigId: string) => any }) {
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));
  return (
    <Card className="sw-gig-card" sx={{ bgcolor: 'text.primary', display: 'flex', flexDirection: 'column', boxShadow: 4 }}>
      <CardContent sx={{ flex: '1', display: 'flex', flexDirection: 'row', padding: '0', paddingBottom: '0 !important' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '70%' }}>
          <Typography sx={{ mt: '5px' }} lineHeight={1} variant={small ? 'body1' : 'h3'} color="primary.main">
            {gig.title}
          </Typography>
          {/* <ReadMore text={gig.description} numberOfLines={6} lineHeight={1.4} showLessButton readMoreCharacterLimit={360} style={{ minHeight: '100px'}} /> */}
          <Typography sx={{ mt: '5px', minHeight: '100px' }} lineHeight={1.4} variant="body2" color="primary.main">
            {gig.description}
          </Typography>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <SwButton
              mode="light"
              btnType="large"
              sx={{ height: '50px !important', boxShadow: 'none' }}
              label="Take this Gig"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(gig.id);
              }}
            />
          </div>
        </Box>
        <Box>
          <Divider orientation="vertical" sx={{ borderRightWidth: '2px', borderColor: 'primary.main', padding: '15px' }} />
        </Box>
        <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '50%',
            }}
          >
            <Typography sx={{ mb: '5px' }} textAlign="center" variant="h3" color="primary.main">
              {gig.credits} DITO
            </Typography>
            <div>
              <DitoCreditsSvg width="30px" />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '50%',
            }}
          >
            <Typography sx={{ textAlign: 'start' }} component="div" variant="h6" color="primary.main">
              Match your skills
            </Typography>
            <Typography sx={{ fontSize: '35px', fontWeight: 'lighter' }} component="div" color="primary.main">
              {gig.props.commitment}%
            </Typography>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
}

export default GigCard;
