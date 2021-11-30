import { Typography } from '@mui/material';
import { Route, Switch } from 'react-router-dom';
import JoinSuccess from './join-success/join-success';
import TownHall from './town-hall/townhall';
import './community.scss';

function Topic() {
  return (
    <Typography
      color="background.paper"
      sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      variant="h3"
    >
      Coming soon!
    </Typography>
  );
}

const Community = (props) => {
  const { path } = props.match;
  return (
    <Switch>
      <Route component={Topic} path={`${path}/skillwallet`} {...props} />
      <Route component={TownHall} path={`${path}/dTown-hall`} {...props} />
      <Route component={Topic} path={`${path}/notifications`} {...props} />
      <Route component={Topic} path={`${path}/settings`} {...props} />
      <Route component={JoinSuccess} path={`${path}/success`} {...props} />
    </Switch>
  );
};

export default Community;
