import { SwAnimated, SwLogoSvg } from "sw-web-shared";
import { Redirect, Route } from "react-router-dom";
import "./community.scss";

const Community = (props) => {
  let { path } = props.match;
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

function Topic(props) {
  return <SwLogoSvg width="50" height="50" />;
}

export default Community;
