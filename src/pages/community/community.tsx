import { Redirect, Route } from 'react-router-dom';
import { DitoLogoSvg } from 'sw-web-shared';
import './community.scss';

function Topic() {
  return <DitoLogoSvg width="50" height="50" />;
}

const Community = (props) => {
  const { path } = props.match;
  return (
    <>
      <Redirect from="/community" to={`${path}/skillwallet`} />
      <Route component={Topic} path={`${path}/skillwallet`} {...props} />
      <Route component={Topic} path={`${path}/dTown-hall`} {...props} />
      <Route component={Topic} path={`${path}/notifications`} {...props} />
      <Route component={Topic} path={`${path}/settings`} {...props} />
    </>
  );
};

export default Community;
