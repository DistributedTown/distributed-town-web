import { Box, IconButton, MobileStepper, ThemeOptions, Tooltip, Button, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Fragment, useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import { SwLayout, SwSidebar, DitoLogoSvg } from 'sw-web-shared';
import CheckIcon from '@mui/icons-material/Check';
import './join.scss';
import { Link, Route, Switch } from 'react-router-dom';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { RootState } from '@dito-store/store.model';
import { useDispatch, useSelector } from 'react-redux';
import { resetJoinCommunityState } from './store/join.reducer';
import Categories from './categories/categories';
import Communities from './communities/communities';
import Skills from './skills/skills';
import UserInfo from './user-info/user-info';

const TopIcon = () => <DitoLogoSvg width="70" height="70" />;

const Join = (props) => {
  const dispatch = useDispatch();
  const { description, title, activeStep, left, toPrevBtnPath, stepperText } = useSelector(
    (state: RootState) => state.joinCommunity.currentStep
  );
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));
  const [steps] = useState([...Array(3)]);
  const [opened, setOpened] = useState(true);
  const [leftSide, setLeftSide] = useState(null);

  const handleToggle = () => setOpened(!opened);

  useEffect(() => {
    if (small) {
      setOpened(false);
    } else {
      setOpened(true);
    }
  }, [small]);

  useEffect(() => {
    setLeftSide(left);
  }, [left]);

  useEffect(
    () => () => {
      dispatch(resetJoinCommunityState());
    },
    [dispatch]
  );

  return (
    <div className="sw-join-base-container">
      <SwLayout
        hideTop={false}
        scrollbarStyles={{ height: `100%` }}
        top={
          <>
            <div>
              {small && (
                <Tooltip title="Open sidebar" placement="right" color="white">
                  <IconButton className="sw-toolbar-button" color="info" onClick={handleToggle}>
                    <MenuIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <Tooltip title="Exit join flow" placement="left" color="white">
              <IconButton className="sw-toolbar-button" color="info" component={Link} to="/">
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </>
        }
        drawer={
          <SwSidebar
            width="30%"
            mode="close"
            preventClose
            handleToggle={handleToggle}
            sidebarTopIcon={TopIcon}
            mobile={small}
            open={opened}
            sx={{ paddingX: 0 }}
          >
            <Box
              sx={{
                px: 4,
              }}
              className="sw-box"
              key={activeStep}
            >
              {leftSide}
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
          <Box sx={{ maxWidth: activeStep !== -1 ? '650px' : '100%', flexGrow: 1 }} className="sw-box-right-inner">
            <Box sx={{ width: '100%' }}>
              {stepperText && (
                <Typography className="stepper-top" sx={{ color: 'text.primary' }} component="div" variant="h6" align="center">
                  {stepperText}
                </Typography>
              )}
              <MobileStepper
                steps={steps.length}
                position="static"
                activeStep={activeStep}
                sx={{
                  padding: 0,
                  height: '40px',
                  display: activeStep !== -1 ? 'flex' : 'none',
                  backgroundColor: 'transparent',
                  width: '100%',
                }}
                nextButton={null}
                backButton={
                  <Button to={toPrevBtnPath || '/'} size="small" color="info" component={Link}>
                    <KeyboardArrowLeft sx={{ marginTop: '-3px' }} />
                    Back
                  </Button>
                }
              />
              <Box sx={{ maxWidth: '450px', width: '100%', margin: '0 auto' }}>
                <div key="stepper-dots" className="stepper-dots" style={{ display: activeStep !== -1 ? 'flex' : 'none' }}>
                  {steps.map((_, index) => {
                    return (
                      <Fragment key={index}>
                        <div className={`stepper-dot ${index === activeStep ? 'active' : ''}`}>
                          {index < activeStep && <CheckIcon color="secondary" />}
                        </div>
                        {steps.length - 1 !== index && <div className="stepper-line" />}
                      </Fragment>
                    );
                  })}
                </div>
                <Typography sx={{ color: 'text.primary', textAlign: 'center', pb: 2 }} component="div" variant="h6">
                  {title}
                </Typography>
                <Typography sx={{ color: 'text.primary', textAlign: 'center', pb: 2 }} component="div" variant="body2">
                  {description}
                </Typography>
              </Box>
            </Box>
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
