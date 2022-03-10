import { Route, Switch } from 'react-router-dom';
import Dashboard from './dashboard/dashboard';
import Gigs from './gigs/gigs';
import NewGig from './gigs/new-gig';

const TownHall = (props) => {
  const { path } = props.match;
  return (
    <Switch>
      <Route component={Dashboard} path={`${path}/dashboard`} {...props} />
      <Route component={Gigs} path={`${path}/gigs`} {...props} />
      <Route component={NewGig} path={`${path}/new-gig`} {...props} />
    </Switch>
  );
};

export default TownHall;
