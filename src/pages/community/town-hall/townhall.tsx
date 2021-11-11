import { Route, Switch } from 'react-router-dom';
import Dashboard from './dashboard/dashboard';
import Gigs from './gigs/gigs';

const TownHall = (props) => {
  const { path } = props.match;

  console.log('path: ', path);
  return (
    <Switch>
      <Route component={Dashboard} path={`${path}/dashboard`} {...props} />
      <Route component={Gigs} path={`${path}/gigs`} {...props} />
    </Switch>
  );
};

export default TownHall;
