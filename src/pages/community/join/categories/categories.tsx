import { CircularProgress, List, ListItem } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  SwButton,
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

export const CategoryIcons = {
  Management: ManagementSvg,
  Network: NetworkSvg,
  NetworkDesign: NetworkSvg,
  TrainSport: TrainSportSvg,
  TrainingSport: TrainSportSvg,
  WebDev: WebDevSvg,
  DeFi: DefiSvg,
  Tokenomics: TokenomicsSvg,
  Painting: PaintingSvg,
  Consensus: ConsensusSvg,
  Photography: PhotographySvg,
  Community: CommunitySvg,
  Governance: GovernanceSvg,
  GovernanceConsensus: GovernanceSvg,
  Teaching: TeachingSvg,
  Architecture: ArchitectureSvg,
  Frontend: FrontendSvg,
  Gardening: GardeningSvg,
  Mobile: MobileSvg,
  MobileDev: MobileSvg,
  Video: VideoSvg,
  VideoMaking: VideoSvg,
  Legal: LegalSvg,
  SmartContracts: SmartContractsSvg,
  GameTheory: GameTheorySvg,
  HouseHolding: HouseHoldingSvg,
  Backend: BackendSvg,
  Blockchain: BlockchainSvg,
  BlockchainInfrastructure: BlockchainSvg,
};

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
          description: 'Just select what you are best at - and we will match with the best communities that need you the most',
          toPrevBtnPath: '/join-community/categories',
          left: null,
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
            className="grid"
            sx={{
              padding: 0,
              display: 'grid',
              width: '100%',
              gridGap: '15px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gridAutoRows: 'minmax(60px, auto)',
            }}
          >
            {entities.map(({ id, name, icon }) => {
              const SwIcon = CategoryIcons[icon];
              return (
                <ListItem key={id} sx={{ height: '45px', width: 'auto' }} disablePadding>
                  <SwButton
                    key={id}
                    sx={{
                      height: '45px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '14px',
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