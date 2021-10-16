import React, { useEffect, useState } from 'react';

import './App.scss';
import SvgIcon from '@mui/material/SvgIcon';
import { defineCustomElements } from '@skill-wallet/auth/loader';
import { renderToStaticMarkup } from 'react-dom/server';
import { withRouter, Route } from 'react-router-dom';
import { SwLayout, MainBackgroundSvg, JoinSelSvg, SwSidebar, DitoLogoSvg } from 'sw-web-shared';

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@dito-store/store';
import Community from './pages/community/community';
import Join from './pages/community/join/join';
import GetStarted from './pages/get-started/get-started';
import { resetAuthState, setAuthenticated } from './auth/auth.reducer';

const svgString = encodeURIComponent(renderToStaticMarkup(<MainBackgroundSvg />));

function Home() {
  return <h2 style={{ color: 'white' }}>Test</h2>;
}

const LoadingMessage = () => (
  <div className="app-loading">
    <DitoLogoSvg width="80" height="80" />
  </div>
);

const PrivateRoutes: React.FC = (props: any) => {
  const { path } = props.match;
  return (
    <>
      <Route path={`${path}/community`} component={Community} {...props} />
      <Route path={`${path}/notifications`} component={Home} {...props} />
    </>
  );
};

const AuthRoutes: React.FC = ({ ...props }: any) => (
  <>
    <Route exact component={GetStarted} path="/" {...props} />
    <Route component={Join} path="/join-community" {...props} />
  </>
);

const App = (props: any) => {
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(true);

  const { isAutheticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const onSWLogin = async () => {
      setLoading(false);
      dispatch(setAuthenticated(true));
    };
    defineCustomElements(window);
    window.addEventListener('onSkillwalletLogin', onSWLogin);

    // temporary
    const timeout = setTimeout(() => {
      if (!isAutheticated) {
        setLoading(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('onSkillwalletLogin', onSWLogin);
    };
  }, [isAutheticated, dispatch]);

  const menuItems: any[] = [
    {
      type: 'href',
      label: 'SkillWallet',
      href: '/community/skillwallet',
      icon: <SvgIcon component={JoinSelSvg} />,
    },
    {
      type: 'href',
      label: 'dTown Hall',
      href: '/community/dTown-hall',
      icon: <SvgIcon component={JoinSelSvg} />,
    },
    {
      type: 'href',
      label: 'Notifications',
      href: '/community/notifications',
      icon: <SvgIcon component={JoinSelSvg} />,
    },
    {
      type: 'href',
      label: 'Settings',
      href: '/community/settings',
      icon: <SvgIcon component={JoinSelSvg} />,
    },
    {
      type: 'divider',
    },
    {
      label: 'Log off',
      type: 'button',
      onClick: () => {
        localStorage.removeItem('skillWallet');
        dispatch(resetAuthState());
        props.history.push('/');
        window.location.reload();
      },
      icon: <SvgIcon component={JoinSelSvg} />,
    },
  ];

  return (
    <SwLayout
      className={isLoading ? 'loading' : ''}
      top={
        <div
          className="wallet-btn"
          style={{
            visibility: isLoading ? 'hidden' : 'visible',
          }}
        >
          {/* @ts-ignore */}
          <skillwallet-auth allowCreateNewUser={false} id="walletButton" />
        </div>
      }
      backgroundUrl={`url('data:image/svg+xml;utf8, ${svgString}')`}
      drawer={isAutheticated && <SwSidebar sidebarTop={<DitoLogoSvg width="100" height="100" />} open menuItems={menuItems} />}
    >
      {isLoading ? <LoadingMessage /> : isAutheticated ? <PrivateRoutes {...props} /> : <AuthRoutes {...props} />}
    </SwLayout>
  );
};

export default withRouter(App);
