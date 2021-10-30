import React, { useEffect, useState } from 'react';

import './App.scss';
import SvgIcon from '@mui/material/SvgIcon';
import { defineCustomElements } from '@skill-wallet/auth/loader';
import { renderToStaticMarkup } from 'react-dom/server';
import { withRouter, Route } from 'react-router-dom';
import {
  SwLayout,
  JoinSelSvg,
  SwSidebar,
  DitoLogoSvg,
  SwButton,
  MainBackgroundSvg,
  LogoffSvg,
  NotificationsSvg,
  SettingsSvg,
  SkillWalletNavSvg,
  TownhallNavSvg,
} from 'sw-web-shared';

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@dito-store/store.model';
import Web3Provider from '@dito-auth/Web3Provider';
import Web3jsComponent from '@dito-auth/Web3jsComponent';
import SWSnackbar from '@dito-components/snackbar';
import { LogsDialog } from '@dito-components/logs-dialog';
import { useMediaQuery, ThemeOptions } from '@mui/material';
import { addLog } from '@dito-store/ui-reducer';
import Community from './pages/community/community';
import Join from './pages/community/join/join';
import GetStarted from './pages/get-started/get-started';
import { resetAuthState, setAuthenticated } from './auth/auth.reducer';

const svgString = encodeURIComponent(renderToStaticMarkup(<MainBackgroundSvg />));

const LoadingMessage = () => (
  <div className="app-loading">
    <DitoLogoSvg width="80" height="80" />
  </div>
);

const PrivateRoutes: React.FC = (props: any) => {
  return (
    <>
      <Route path="/community" component={Community} {...props} />
    </>
  );
};

const AuthRoutes: React.FC = (props: any) => {
  return (
    <>
      <Route exact component={GetStarted} path="/" {...props} />
      <Route component={Join} path="/join-community" {...props} />
    </>
  );
};

const originalConsoleError = console.error;

const App = (props: any) => {
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(true);
  const [logInitialized, setLogInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));

  const { isAutheticated } = useSelector((state: RootState) => state.auth);
  const { logs } = useSelector((state: RootState) => state.ui);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (logInitialized) {
      return;
    }
    setLogInitialized(true);
    console.error = (...args: any[]) => {
      dispatch(addLog(args));
      originalConsoleError.apply(console, args);
    };
  }, [logInitialized, dispatch]);

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
      icon: <SvgIcon component={SkillWalletNavSvg} />,
    },
    {
      type: 'href',
      label: 'dTown Hall',
      href: '/community/dTown-hall',
      icon: <SvgIcon component={TownhallNavSvg} />,
    },
    {
      type: 'href',
      label: 'Notifications',
      href: '/community/notifications',
      icon: <SvgIcon component={NotificationsSvg} />,
    },
    {
      type: 'href',
      label: 'Settings',
      href: '/community/settings',
      icon: <SvgIcon component={SettingsSvg} />,
    },
    {
      type: 'href',
      label: 'Community',
      href: '/community/success?communityAddress=0xC643138abBcb8396718D7040859fee7905c65B05&diToCredits=2060',
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
      icon: <SvgIcon component={LogoffSvg} />,
    },
  ];

  return (
    <Web3Provider>
      <Web3jsComponent>
        <>
          <LogsDialog open={open} handleClose={handleClose} logs={logs} fullScreen={small} />
          <SWSnackbar />
          <SwLayout
            className={isLoading ? 'loading' : ''}
            top={
              <div
                className="wallet-btn"
                style={{
                  display: 'flex',
                  visibility: isLoading ? 'hidden' : 'visible',
                }}
              >
                {/* @ts-ignore */}
                <skillwallet-auth allowCreateNewUser={false} id="walletButton" />
                <SwButton sx={{ height: '33px', ml: 2 }} label="Open logs" onClick={() => setOpen(true)} />
              </div>
            }
            backgroundUrl={`url('data:image/svg+xml;utf8, ${svgString}')`}
            drawer={isAutheticated && <SwSidebar sidebarTop={<DitoLogoSvg width="100" height="100" />} open menuItems={menuItems} />}
          >
            {isLoading ? <LoadingMessage /> : isAutheticated ? <PrivateRoutes {...props} /> : <AuthRoutes {...props} />}
          </SwLayout>
        </>
      </Web3jsComponent>
    </Web3Provider>
  );
};

export default withRouter(App);
