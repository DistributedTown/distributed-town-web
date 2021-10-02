import React from "react";
import "./community.scss";
import { SwLogoSvg } from "sw-web-shared";
import {
  Redirect,
  Route,
} from "react-router-dom";

interface CommunityState {
  isLoading: boolean;
  isAutheticated: boolean;
}

class Community extends React.Component<any, CommunityState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isAutheticated: false,
    };
  }

  componentDidMount() {
    console.log(this.props);
  }

  componentWillUnmount() {}

  render() {
    let { path } = this.props.match;
    return (
      <>
        <Redirect from="/community" to={`${path}/dTown-hall`} />
        <Route path={`${path}/dTown-hall`} component={Topic} />
      </>
    );
  }
}

function Topic() {
  return <SwLogoSvg width="50" height="50" />;
}

export default Community;
