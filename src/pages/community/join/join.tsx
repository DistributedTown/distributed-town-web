import { Box, ThemeOptions, Tooltip, Button, IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useState } from 'react';
import { SwLayout, SwSidebar, SwStepper } from 'sw-web-shared';
import { Link, Route, Switch } from 'react-router-dom';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { RootState } from '@dito-store/store.model';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import { resetJoinCommunityState } from './store/join.reducer';
import Categories from './categories/categories';
import Communities from './communities/communities';
import Skills from './skills/skills';
import UserInfo from './user-info/user-info';
import CategoriesLeftSide from './categories/categories-left';
import UserInfoLeftSide from './user-info/user-info-left';
import SkillsLeftSide from './skills/skills-left';
import './join.scss';

const Join = (props) => {
  const dispatch = useDispatch();
  const { description, title, activeStep, descriptionTooltip, toPrevBtnPath, stepperText } = useSelector(
    (state: RootState) => state.joinCommunity.currentStep
  );
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));
  const [steps] = useState([...Array(3)]);
  const [opened, setOpened] = useState(true);

  const handleToggle = () => setOpened(!opened);

  useEffect(() => {
    if (small) {
      setOpened(false);
    } else {
      setOpened(true);
    }
  }, [small]);

  useEffect(
    () => () => {
      dispatch(resetJoinCommunityState());
    },
    [dispatch]
  );

  return (
    <div className="sw-join-base-container">
      <SwLayout
        hideTop
        scrollbarStyles={{ height: '100%' }}
        top={null}
        drawer={
          <SwSidebar
            width="530px"
            mode="close"
            preventClose
            handleToggle={handleToggle}
            sidebarTopIcon={null}
            mobile={small}
            open={opened}
            sx={{ paddingX: 0 }}
          >
            <Box
              sx={{
                height: '100%',
                px: 7,
              }}
              className="sw-box"
            >
              <Switch>
                <Route path="/join-community/categories" component={CategoriesLeftSide} {...props} />
                <Route path="/join-community/user-info" component={UserInfoLeftSide} {...props} />
                <Route path="/join-community/skills" component={SkillsLeftSide} {...props} />
                <Route path="/join-community/communities" component={SkillsLeftSide} {...props} />
              </Switch>
            </Box>
          </SwSidebar>
        }
      >
        <Box
          sx={{
            p: 0,
            m: 0,
            gridGap: '0',
          }}
          className="sw-box"
        >
          <div className="sw-menu-icon">
            {small && (
              <Tooltip title="Open sidebar" placement="right" color="white">
                <IconButton className="sw-toolbar-button" color="info" onClick={handleToggle}>
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <Box sx={{ maxWidth: activeStep !== -1 ? '650px' : '100%', flexGrow: 1 }} className="sw-box-right-inner">
            <SwStepper
              stepperText={stepperText}
              title={title}
              steps={steps}
              description={description}
              activeStep={activeStep}
              descriptionTooltip={descriptionTooltip}
              backButton={
                <Button to={toPrevBtnPath || '/'} size="small" color="info" component={Link}>
                  <KeyboardArrowLeft sx={{ marginTop: '-3px' }} />
                  Back
                </Button>
              }
            />
            <Box className="sw-box" sx={{ maxWidth: activeStep === -1 ? '100%' : '450px', width: '100%', margin: '20px auto' }}>
              <Switch>
                <Route path="/join-community/categories" component={Categories} {...props} />
                <Route path="/join-community/user-info" component={UserInfo} {...props} />
                <Route path="/join-community/skills" component={Skills} {...props} />
                <Route path="/join-community/communities" component={Communities} {...props} />
              </Switch>
            </Box>
          </Box>
        </Box>
      </SwLayout>
    </div>
  );
};

export default Join;
