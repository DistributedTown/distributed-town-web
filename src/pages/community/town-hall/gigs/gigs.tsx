import { SwUserSkillsLegend } from '@dito-components/user-skills-legend';
import { ResultState } from '@dito-store/status';
import { RootState } from '@dito-store/store.model';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../../store/community.reducer';
import { Gig } from '../../store/model';
import GigCard from './gig-card';
import './gigs.scss';

const Gigs = () => {
  const dispatch = useDispatch();
  const { status, community, gigs } = useSelector((state: RootState) => state.community);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!gigs.length && community?.address) {
      dispatch(fetchGigs(community?.address));
    }
  }, [dispatch, community?.address, gigs]);

  return (
    <div className="sw-container">
      <div className="sw-user-container">
        <SwUserSkillsLegend user={userInfo} />
      </div>
      <div className="sw-gigs-container">
        <div className="sw-gigs-top">
          <Typography
            color="background.paper"
            sx={{ mb: 4, height: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center' }}
            variant="h4"
          >
            Open Gigs
          </Typography>
        </div>

        <Box className="sw-box-right-inner">
          {status === ResultState.Loading ? (
            <CircularProgress sx={{ color: 'background.paper' }} />
          ) : (
            <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 4, md: 12, lg: 15, xl: 16 }}>
              {gigs.map((gig: Gig, index) => (
                <Grid item xs={4} sm={4} md={6} lg={5} xl={4} key={index}>
                  <GigCard gig={gig} key={`gig-${index}`} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </div>
    </div>
  );
};

export default Gigs;
