import { Redirect, Route } from 'react-router-dom';
import Dashboard from './dashboard/dashboard';
import Gigs from './gigs/gigs';

const TownHall = (props) => {
  const { path } = props.match;

  return (
    <>
      <Redirect to={`${path}/dashboard`} />
      <Route component={Dashboard} path={`${path}/dashboard`} {...props} />
      <Route component={Gigs} path={`${path}/gigs`} {...props} />
    </>
  );
};

export default TownHall;
