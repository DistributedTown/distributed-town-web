import React from "react";
import "./App.scss";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SwLayout,
  MainBackgroundSvg,
  JoinSelSvg,
  SwSidebar,
  SwLogoSvg,
} from "sw-web-shared";
import { defineCustomElements } from "@skill-wallet/auth/loader";
import SvgIcon from "@mui/material/SvgIcon";
import { Switch, Route, withRouter } from "react-router-dom";
import GetStarted from "./pages/get-started/get-started";
import Community from "./pages/community/community";

const svgString = encodeURIComponent(
  renderToStaticMarkup(<MainBackgroundSvg />)
);

interface AppState {
  isLoading: boolean;
  isAutheticated: boolean;
}

class App extends React.Component<any, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isAutheticated: false,
    };
  }

  componentDidMount() {
    defineCustomElements(window);
    // @TODO remove this once Mike has added a ne even listener
    const skillwallet = JSON.parse(localStorage.getItem("skillWallet") || "{}");
    this.setState({ isLoading: !skillwallet });
    window.addEventListener("onSkillwalletLogin", this.onSWLogin.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("onSkillwalletLogin", this.onSWLogin.bind(this));
  }

  onSWLogin() {
    setTimeout(
      () => this.setState({ isLoading: false, isAutheticated: true }),
      2000
    );
  }

  render() {
    const menuItems: any[] = [
      {
        label: "SkillWallet",
        href: "/",
        icon: <SvgIcon component={JoinSelSvg} />,
      },
      {
        label: "dTown Hall",
        href: "/community/dTown-hall",
        icon: <SvgIcon component={JoinSelSvg} />,
      },
      {
        label: "Notifications",
        href: "/community/notifications",
        icon: <SvgIcon component={JoinSelSvg} />,
      },
      {
        label: "Settings",
        href: "/community/settings",
        icon: <SvgIcon component={JoinSelSvg} />,
      },
      {
        type: "divider",
      },
      {
        label: "Log off",
        href: "/community/logout",
        icon: <SvgIcon component={JoinSelSvg} />,
      },
    ];

    return (
      <SwLayout
        className={this.state.isLoading ? "loading" : ""}
        children={
          <>
            <div
              className="wallet-btn"
              style={{
                visibility: this.state.isLoading ? "hidden" : "visible",
              }}
            >
              {/* @ts-ignore */}
              <skillwallet-auth id="walletButton" />
            </div>
            {this.state.isLoading ? (
              <LoadingMessage />
            ) : this.state.isAutheticated ? (
              <PrivateRoutes />
            ) : (
              <AuthRoutes />
            )}
          </>
        }
        backgroundUrl={`url('data:image/svg+xml;utf8, ${svgString}')`}
        drawer={
          this.state.isAutheticated && (
            <SwSidebar open={true} menuItems={menuItems} />
          )
        }
      />
    );
  }
}

export default withRouter(App);

function Home() {
  return (
    <h2 style={{ color: "white" }}>
      Test
    </h2>
  );
}

const LoadingMessage = () => (
  <div className="app-loading">
    <SwLogoSvg width="80" height="80" />
  </div>
);

const PrivateRoutes: React.FC = () => {
  return (
    <>
      <Switch>
        {/* <Redirect to="/community/dTown-hall" /> */}
        <Route path="/community" component={Community} />
        <Route path="/notifications" component={Home} />
      </Switch>
    </>
  );
};

const AuthRoutes: React.FC = () => {
  return (
    <>
      <Switch>
        {/* <Redirect to="/" /> */}
        <Route exact path="/" component={GetStarted} />
      </Switch>
    </>
  );
};
