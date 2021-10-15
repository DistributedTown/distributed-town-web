import React, { useEffect, useState } from 'react';

import './App.scss';
import SvgIcon from '@mui/material/SvgIcon';
import { defineCustomElements } from '@skill-wallet/auth/loader';
import { renderToStaticMarkup } from 'react-dom/server';
import { withRouter, RouteProps, Route } from 'react-router-dom';
import { SwLayout, MainBackgroundSvg, JoinSelSvg, SwSidebar, DitoLogoSvg } from 'sw-web-shared';

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@dito-store/store';
import Community from './pages/community/community';
import Join from './pages/community/join/join';
import GetStarted from './pages/get-started/get-started';
import {
  ensureEtheruemNetworkIsCorrect,
  ensureEtheruemIsConnected,
  getOrCreateTextileBucket,
  joinCommunityMembership,
  setAuthenticated,
  claimCommunityMembership,
} from './auth/auth.reducer';

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

const App = (props: RouteProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setLoading] = useState(true);

  const { isAutheticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const community = {
      name: 'Local Projects & DAOs',
      members: 1,
      scarcityScore: 0,
      address: '0x04c98BDA5DF252F53Ae026ae7af9e294F204D58d',
      description: 'From support for people in need, to innovative local hubs to get together & create something greater than oneself.',
    };
    const skillsJson = {
      skill1: {
        level: 4,
        displayStringId: 32,
        skillName: 'DeFi',
      },
      skill2: {
        level: 2,
        displayStringId: 28,
        skillName: 'Backend',
      },
      skill3: {
        level: 4,
        displayStringId: 24,
        skillName: 'Network Design',
      },
    };
    const username = 'Tao';
    const skillsFormated = {
      skills: [
        {
          name: skillsJson.skill1.skillName,
          value: skillsJson.skill1.level,
        },
        {
          name: skillsJson.skill2.skillName,
          value: skillsJson.skill2.level,
        },
      ],
    };
    if (skillsJson.skill3) {
      skillsFormated.skills.push({
        name: skillsJson.skill3.skillName,
        value: skillsJson.skill3.level,
      });
    }
    const metadataJson = {
      name: `${username}'s SkillWallet`,
      description: 'Universal, self-sovereign IDs tied to skills & contributions rather than personal data.',
      image: null,
      properties: {
        username,
        skills: skillsFormated.skills,
      },
    };

    const load = async () => {
      if (isAutheticated) {
        console.log('before actions');
        const connection = await dispatch(ensureEtheruemIsConnected());
        const isConnected = connection.payload as boolean;
        if (isConnected) {
          const network = await dispatch(ensureEtheruemNetworkIsCorrect());
          const isCorrectNetwork = network.payload as boolean;
          if (isCorrectNetwork) {
            const textile = await dispatch(getOrCreateTextileBucket(metadataJson as any));

            console.log(textile, 'textile');
            const skillwalletJoin = await dispatch(
              joinCommunityMembership({
                url: textile.payload as string,
                credits: '2222',
                communityAddress: community.address,
              })
            );
            console.log('joinCommunityMembership', skillwalletJoin.payload);
            const skillwalletClaim = await dispatch(claimCommunityMembership(community.address));
            console.log('claimCommunityMembership', skillwalletClaim.payload);
          } else {
            // We could not set the correct network.
            // Please manually set the mumbay network.
          }
        } else {
          // tell user to connect to metamask and retry
        }
      }
    };

    load();
  }, [dispatch, isAutheticated]);

  useEffect(() => {
    const onSWLogin = async () => {
      setLoading(false);
      dispatch(setAuthenticated(true));

      // try {
      //   await changeNetwork();
      //   await connectToEthereum();
      //   const url = await pushJSONDocument(metadataJson);
      //   const tokenId = await joinCommunityContract(community.address, url, totalDitos);
      // } catch (error) {
      //   console.log(error);
      // }
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
        // localStorage.removeItem("skillWallet");
        // setAuthenticated(false);
        // history.push("/");
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
          <skillwallet-auth id="walletButton" />
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
