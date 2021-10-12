import React, { useEffect, useState } from "react";
import "./App.scss";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SwLayout,
  MainBackgroundSvg,
  JoinSelSvg,
  SwSidebar,
  DitoLogoSvg,
  SwAnimated,
} from "sw-web-shared";
import { defineCustomElements } from "@skill-wallet/auth/loader";
import SvgIcon from "@mui/material/SvgIcon";
import { withRouter, RouteProps, Route } from "react-router-dom";
import GetStarted from "./pages/get-started/get-started";
import Community from "./pages/community/community";
import Join from "./pages/community/join/join";
import { QueryClient, QueryClientProvider } from "react-query";

const svgString = encodeURIComponent(
  renderToStaticMarkup(<MainBackgroundSvg />)
);

const App = (props: RouteProps) => {
  const queryClient = new QueryClient();
  const [isLoading, setLoading] = useState(true);
  const [isAutheticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const onSWLogin = () => {
      setLoading(false);
      setAuthenticated(true);
    };
    defineCustomElements(window);
    window.addEventListener("onSkillwalletLogin", onSWLogin);

    // temporary
    const timeout = setTimeout(() => {
      if (!isAutheticated) {
        setLoading(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("onSkillwalletLogin", onSWLogin);
    };
  }, [isAutheticated]);

  const menuItems: any[] = [
    {
      type: "href",
      label: "SkillWallet",
      href: "/community/skillwallet",
      icon: <SvgIcon component={JoinSelSvg} />,
    },
    {
      type: "href",
      label: "dTown Hall",
      href: "/community/dTown-hall",
      icon: <SvgIcon component={JoinSelSvg} />,
    },
    {
      type: "href",
      label: "Notifications",
      href: "/community/notifications",
      icon: <SvgIcon component={JoinSelSvg} />,
    },
    {
      type: "href",
      label: "Settings",
      href: "/community/settings",
      icon: <SvgIcon component={JoinSelSvg} />,
    },
    {
      type: "divider",
    },
    {
      label: "Log off",
      type: "button",
      onClick: (e) => {
        // localStorage.removeItem("skillWallet");
        // setAuthenticated(false);
        // history.push("/");
      },
      icon: <SvgIcon component={JoinSelSvg} />,
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <SwLayout
        className={isLoading ? "loading" : ""}
        top={
          <div
            className="wallet-btn"
            style={{
              visibility: isLoading ? "hidden" : "visible",
            }}
          >
            {/* @ts-ignore */}
            <skillwallet-auth id="walletButton" />
          </div>
        }
        children={
          <>
            {isLoading ? (
              <LoadingMessage />
            ) : isAutheticated ? (
              <PrivateRoutes {...props} />
            ) : (
              <AuthRoutes {...props} />
            )}
          </>
        }
        backgroundUrl={`url('data:image/svg+xml;utf8, ${svgString}')`}
        drawer={
          isAutheticated && (
            <SwSidebar
              sidebarTop={<DitoLogoSvg width="100" height="100" />}
              open={true}
              menuItems={menuItems}
            />
          )
        }
      />
    </QueryClientProvider>
  );
};

export default withRouter(App);

function Home() {
  return <h2 style={{ color: "white" }}>Test</h2>;
}

const LoadingMessage = () => (
  <div className="app-loading">
    <DitoLogoSvg width="80" height="80" />
  </div>
);

const PrivateRoutes: React.FC = (props: any) => {
  let { path } = props.match;
  return (
    <>
      <Route path={`${path}/community`} component={Community} {...props} />
      <Route path={`${path}/notifications`} component={Home} {...props} />
    </>
  );
};

const AuthRoutes: React.FC = ({ ...props }: any) => {
  return (
    <>
      <Route exact={true} component={GetStarted} path={`/`} {...props} />
      <Route component={Join} path={`/join-community`} {...props} />
    </>
  );
};
