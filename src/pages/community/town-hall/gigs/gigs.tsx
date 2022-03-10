import { SwUserSkillsLegend } from '@dito-components/user-skills-legend';
import { ResultState } from '@dito-store/status';
import { RootState } from '@dito-store/store.model';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SwButton } from 'sw-web-shared';
import { fetchGigs, takeGig } from '../../store/gigs.reducer';
import { Gig } from '../../store/model';
import GigCard from './gig-card';
import './gigs.scss';

const Gigs = () => {
  const dispatch = useDispatch();
  const { community } = useSelector((state: RootState) => state.community);
  const { status, gigs } = useSelector((state: RootState) => state.gigs);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const take = async (gigId) => {
    dispatch(takeGig(gigId));
  };

  useEffect(() => {
    if (!gigs.length && community?.address) {
      dispatch(fetchGigs(community?.address));
    }
  }, [dispatch, community?.address, gigs]);

  return (
    <div className="sw-container">
      <div className="sw-user-container">
        <SwUserSkillsLegend
          username={userInfo?.nickname}
          avatar={userInfo?.imageUrl}
          creditSkills={userInfo?.skills}
          totalCredits={userInfo?.totalCredits}
        />
      </div>
      <div className="sw-gigs-container">
        <div className="sw-gigs-top">
          <Typography
            color="background.paper"
            sx={{ mb: 4, height: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center' }}
            variant="h1"
          >
            Open Gigs
          </Typography>
          <SwButton
            mode="dark"
            btnType="medium"
            endIcon={<AddCircleIcon />}
            label="Create a Gig"
            component={Link}
            to="/community/dTown-hall/new-gig"
          />
        </div>

        <Box className="sw-box-right-inner">
          {status === ResultState.Loading ? (
            <CircularProgress sx={{ color: 'background.paper' }} />
          ) : (
            <Grid container spacing={{ xs: 2, md: 4 }} direction="row" justifyContent="center" alignItems="center" columns={1}>
              {gigs.map((gig: Gig, index) => (
                <Grid item xs={4} sm={4} md={6} lg={5} xl={4} key={index}>
                  <GigCard gig={gig} key={`gig-${index}`} onSelect={take} />
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
