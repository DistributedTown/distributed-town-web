import { Route } from 'react-router-dom';
import { DitoLogoSvg } from 'sw-web-shared';
import './community.scss';
import JoinSuccess from './join-success/join-success';

function Topic() {
  return <DitoLogoSvg width="50" height="50" />;
}

const Community = (props) => {
  const { path } = props.match;
  return (
    <>
      <Route component={Topic} path={`${path}/skillwallet`} {...props} />
      <Route component={Topic} path={`${path}/dTown-hall`} {...props} />
      <Route component={Topic} path={`${path}/notifications`} {...props} />
      <Route component={Topic} path={`${path}/settings`} {...props} />
      <Route component={JoinSuccess} path={`${path}/success`} {...props} />
    </>
  );
};

export default Community;
