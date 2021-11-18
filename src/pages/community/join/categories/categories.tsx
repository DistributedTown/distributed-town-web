import { CircularProgress, List, ListItem } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
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
import { fetchCategories, selectCategory, setCurrentStep } from '../store/join.reducer';

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

export const LeftSide = () => (
  <SwQuote key="categories-1">
    <>
      <p>
        Have you ever thought, <br />
        "I would like to contribute, but ..."
      </p>
      <p className="mt-4 mb-4">Distributed Town (DiTo) lets you create or join a community with one click.</p>
    </>
  </SwQuote>
);

const Categories = () => {
  const dispatch = useDispatch();
  const { activeStep } = useSelector((state: RootState) => state.joinCommunity.currentStep);
  const { entities, status, selectedCategory } = useSelector((state: RootState) => state.joinCommunity.category);
  const userInfo = useSelector((state: RootState) => state.joinCommunity.userInfo);

  useEffect(() => {
    if (!entities.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, entities, userInfo]);

  useEffect(() => {
    if (activeStep !== -1) {
      dispatch(
        setCurrentStep({
          activeStep: -1,
          title: 'Pick your interest',
          description: 'Just select what you are best at - and we will match with the best communities that need you the most 🙌',
          toPrevBtnPath: '/join-community/categories',
          left: LeftSide,
        })
      );
    }
  }, [dispatch, activeStep]);

  return (
    <>
      {status === ResultState.Loading ? (
        <CircularProgress sx={{ color: 'text.primary', mt: 2 }} />
      ) : (
        <div className="sw-category-wrapper">
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
                    onClick={async () => {
                      await dispatch(selectCategory(name));
                      // props.history.push(`/join-community/user-info`);
                    }}
                    className={selectedCategory === name ? 'active-link' : ''}
                    startIcon={<SwIcon className="sw-btn-icon" width="14px" />}
                    label={name}
                  />
                </ListItem>
              );
            })}
          </List>

          <div className="bottom-action">
            <SwButton
              disabled={selectedCategory === null || status === ResultState.Loading}
              component={Link}
              to="/join-community/user-info"
              label="Next: Create your Account"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
