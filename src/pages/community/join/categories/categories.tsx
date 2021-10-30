import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, List, ListItem, ThemeOptions, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  DitoLogoSvg,
  SwButton,
  SwQuote,
  ManagementSvg,
  ArchitectureSvg,
  BackendSvg,
  BlockchainSvg,
  CommunitySvg,
  DefiSvg,
  FrontendSvg,
  GameTheorySvg,
  GardeningSvg,
  GovernanceSvg,
  HouseHoldingSvg,
  LegalSvg,
  MobileSvg,
  NetworkSvg,
  PaintingSvg,
  PhotographySvg,
  SmartContractsSvg,
  TeachingSvg,
  TokenomicsSvg,
  TrainSportSvg,
  VideoSvg,
  WebDevSvg,
  ConsensusSvg,
} from 'sw-web-shared';
import { RootState } from '@dito-store/store.model';

import { ResultState } from '@dito-store/status';
import JoinBaseLayout from '../base/join-base';
import { fetchCategories, selectCategory } from '../store/join.reducer';

import './categories.scss';

const Icons = {
  Management: ManagementSvg,
  Network: NetworkSvg,
  TrainSport: TrainSportSvg,
  WebDev: WebDevSvg,
  Defi: DefiSvg,
  Tokenomics: TokenomicsSvg,
  Painting: PaintingSvg,
  Consensus: ConsensusSvg,
  Photography: PhotographySvg,
  Community: CommunitySvg,
  Governance: GovernanceSvg,
  Teaching: TeachingSvg,
  Architecture: ArchitectureSvg,
  Frontend: FrontendSvg,
  Gardening: GardeningSvg,
  Mobile: MobileSvg,
  Video: VideoSvg,
  Legal: LegalSvg,
  SmartContracts: SmartContractsSvg,
  GameTheory: GameTheorySvg,
  HouseHolding: HouseHoldingSvg,
  Backend: BackendSvg,
  Blockchain: BlockchainSvg,
};

const Categories = () => {
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));

  const dispatch = useDispatch();
  const { entities, status, selectedCategory } = useSelector((state: RootState) => state.joinCommunity.category);
  const userInfo = useSelector((state: RootState) => state.joinCommunity.userInfo);

  useEffect(() => {
    if (!entities.length && userInfo?.name && userInfo?.avatar) {
      dispatch(fetchCategories());
    }
  }, [dispatch, entities, userInfo]);

  return (
    <JoinBaseLayout
      status={status}
      className="sw-categories-container"
      left={
        <>
          <Box className="sw-box-logo">
            <DitoLogoSvg width={largeDevice ? '100px' : '80px'} />
          </Box>

          <SwQuote mobile={small} mobileStartText={<p>Have you ever thought...</p>}>
            <>
              <p>
                Have you ever thought, <br />
                "I would like to contribute, but ..."
              </p>
              <p className="mt-4 mb-4">Distributed Town (DiTo) lets you create or join a community with one click.</p>

              <p>Just select what you are best at - and we will match with the best communities that need you the most.</p>
            </>
          </SwQuote>
        </>
      }
      right={
        <div className="sw-category-wrapper">
          <Typography sx={{ color: 'background.paper', textAlign: 'center', pb: 2 }} component="div" variant="h6">
            Pick a category
          </Typography>

          {userInfo?.name && userInfo?.avatar ? (
            <List
              sx={{
                display: 'grid',
                width: '100%',
                gridGap: '15px',
                padding: 0,
                gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
                gridAutoRows: 'minmax(60px, auto)',
              }}
            >
              {entities.map(({ id, name, icon }) => {
                const SwIcon = Icons[icon];
                return (
                  <ListItem key={id} sx={{ height: '45px' }} disablePadding>
                    <SwButton
                      sx={{
                        height: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                      }}
                      onClick={() => dispatch(selectCategory(name))}
                      className={selectedCategory === name ? 'active-link' : ''}
                      startIcon={<SwIcon className="sw-btn-icon" width="14px" />}
                      label={name}
                    />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography
              className="no-item-selected"
              sx={{ color: 'background.paper', textAlign: 'center', pb: 2 }}
              component="div"
              variant="h6"
            >
              Personal information was not provided, go back to provide it!
            </Typography>
          )}
        </div>
      }
      prevBtn={<SwButton startIcon={<NavigateBeforeIcon />} component={Link} to="/join-community/user-info" label="Prev" />}
      nextBtn={
        <SwButton
          disabled={selectedCategory === null || status === ResultState.Loading || !(userInfo?.name && userInfo?.avatar)}
          endIcon={<NavigateNextIcon />}
          component={Link}
          to="/join-community/skills"
          label={small ? 'Next' : 'Next: Pick your skills'}
        />
      }
    />
  );
};

export default Categories;
