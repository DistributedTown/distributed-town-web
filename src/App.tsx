import React, { useEffect, useState } from 'react';

import './App.scss';
import SvgIcon from '@mui/material/SvgIcon';
import MenuIcon from '@mui/icons-material/Menu';
import { defineCustomElements } from '@skill-wallet/auth/loader';
import { renderToStaticMarkup } from 'react-dom/server';
import { withRouter, Route, Switch } from 'react-router-dom';
import {
  SwLayout,
  JoinSelSvg,
  SwSidebar,
  DitoLogoSvg,
  SwButton,
  MainBackgroundSvg,
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
import { useMediaQuery, ThemeOptions, IconButton, Tooltip, Typography } from '@mui/material';
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

function NoMatch() {
  return (
    <Typography
      color="background.paper"
      sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      variant="h3"
    >
      404 Not found!
    </Typography>
  );
}

const PrivateRoutes: React.FC = (props: any) => {
  return (
    <Switch>
      <Route path="/community" component={Community} {...props} />
      <Route path="*" component={NoMatch} />
    </Switch>
  );
};

const AuthRoutes: React.FC = (props: any) => {
  return (
    <Switch>
      <Route exact component={GetStarted} path="/" {...props} />
      <Route component={Join} path="/join-community" {...props} />
      <Route path="*" component={NoMatch} />
    </Switch>
  );
};

const originalConsoleError = console.error;

const App = (props: any) => {
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(true);
  const [logInitialized, setLogInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = React.useState(true);

  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));

  const { isAutheticated } = useSelector((state: RootState) => state.auth);
  const { logs } = useSelector((state: RootState) => state.ui);

  const isJoinFlow = props?.location?.pathname?.includes('join-community');

  const handleClose = () => setOpen(false);
  const handleToggle = () => setOpened(!opened);

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
    const onSWLogin = async ({ detail }: any) => {
      const isLoggedIn = !!detail;
      const hasSkillwalletSessionStorage = sessionStorage.getItem('skillWallet');
      if (isLoggedIn && hasSkillwalletSessionStorage) {
        dispatch(setAuthenticated(true));
        props.history.push('/community/dTown-hall/dashboard');
      } else {
        dispatch(resetAuthState());
        props.history.push('/');
      }
    };
    const onSWInit = async () => setLoading(false);
    defineCustomElements(window);
    window.addEventListener('initSkillwalletAuth', onSWInit);
    window.addEventListener('onSkillwalletLogin', onSWLogin);

    return () => {
      window.removeEventListener('initSkillwalletAuth', onSWInit);
      window.removeEventListener('onSkillwalletLogin', onSWLogin);
    };
  }, [isAutheticated, dispatch, props.history]);

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
      href: '/community/dTown-hall/dashboard',
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
    // {
    //   type: 'divider',
    // },
    // {
    //   label: 'Log off',
    //   type: 'button',
    //   onClick: () => {
    //     session.removeItem('skillWallet');
    //     dispatch(resetAuthState());
    //     props.history.push('/');
    //     window.location.reload();
    //   },
    //   icon: <SvgIcon component={LogoffSvg} />,
    // },
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
                className="top-bar"
                style={{
                  visibility: isLoading ? 'hidden' : 'visible',
                }}
              >
                <div className="left">
                  {small && isAutheticated && (
                    <Tooltip title="Open sidebar" placement="right" color="white">
                      <IconButton className="sw-sidebar-close-button" color="secondary" onClick={handleToggle}>
                        <MenuIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
                <div className="right">
                  {/* @ts-ignore */}
                  <skillwallet-auth
                    style={{
                      visibility: isJoinFlow ? 'hidden' : 'visible',
                    }}
                    allowCreateNewUser={false}
                    id="walletButton"
                  />
                  <SwButton sx={{ width: '120px', height: '33px', ml: 2 }} label="Logs" onClick={() => setOpen(true)} />
                </div>
              </div>
            }
            backgroundUrl={`url('data:image/svg+xml;utf8, ${svgString}')`}
            drawer={
              isAutheticated && (
                <SwSidebar
                  // @ts-ignore
                  handleToggle={() => handleToggle()}
                  sidebarTopIcon={DitoLogoSvg}
                  mobile={small}
                  open={opened}
                  menuItems={menuItems}
                />
              )
            }
          >
            {isLoading ? <LoadingMessage /> : isAutheticated ? <PrivateRoutes {...props} /> : <AuthRoutes {...props} />}
          </SwLayout>
        </>
      </Web3jsComponent>
    </Web3Provider>
  );
};

export default withRouter(App);
