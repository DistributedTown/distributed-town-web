import { Avatar, Box, Card, CardContent, CardHeader, SvgIcon, ThemeOptions, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { SwButton, SwDivider, OpenGigsSvg, ProjectsSvg, TreasurySvg } from 'sw-web-shared';
import './dashboard.scss';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';

const defaultHoverContent = {
  title: 'The Dark DiTo',
  isDefault: true,
  icon: OpenGigsSvg,
  description:
    // eslint-disable-next-line max-len
    'The greatest Description you could think of. A story about passion, cooperation, conflict & chaos - unveiling, word by word, a deeper truth about humankind.',
};
const Dashboard = () => {
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const [hoveredContent, setHoveredContent] = useState(defaultHoverContent);
  const debouncedHoverHandler = useMemo(() => {
    const changeHandler = (content: any) => {
      if (content) {
        setHoveredContent(content);
      } else {
        setHoveredContent(defaultHoverContent);
      }
    };
    return debounce(changeHandler, 200);
  }, []);

  useEffect(() => {
    return () => debouncedHoverHandler.cancel();
  }, [debouncedHoverHandler]);

  return (
    <div className="sw-dashboard-container">
      <Box
        sx={{
          p: 0,
          m: 0,
          gridGap: '30px',
        }}
        className="sw-box"
      >
        <Typography sx={{ color: 'text.primary', textAlign: 'center', pb: 2 }} component="div" variant="h1">
          Welcome to diTown Hall <br />
          <small>where everything happens</small>
        </Typography>

        <SwButton
          mode="light"
          btnType="large"
          endIcon={<OpenGigsSvg className="sw-btn-icon" width="30px" />}
          label="Open Gigs"
          component={Link}
          to="/community/dTown-hall/gigs"
          onMouseEnter={() =>
            debouncedHoverHandler({
              title: 'Gigs',
              icon: OpenGigsSvg,
              description: 'Gigs description',
            })
          }
          onMouseLeave={() => debouncedHoverHandler(null)}
        />
        <SwButton
          mode="light"
          btnType="large"
          endIcon={<ProjectsSvg className="sw-btn-icon" width="30px" />}
          label="Projects"
          to="/community/town-hall/projects"
          onMouseEnter={() =>
            debouncedHoverHandler({
              title: 'Projects',
              icon: ProjectsSvg,
              description: 'Projects description',
            })
          }
          onMouseLeave={() => debouncedHoverHandler(null)}
        />
        <SwButton
          mode="light"
          btnType="large"
          endIcon={<TreasurySvg className="sw-btn-icon" width="30px" />}
          label="Treasury"
          to="/community/town-hall/treasury"
          onMouseEnter={() =>
            debouncedHoverHandler({
              title: 'Treasury',
              icon: TreasurySvg,
              description: 'Treasury description',
            })
          }
          onMouseLeave={() => debouncedHoverHandler(null)}
        />
      </Box>
      <SwDivider width="1px" orientation={largeDevice ? 'vertical' : 'horizontal'} />
      <Box
        sx={{
          p: 0,
          m: 0,
          gridGap: '20px',
        }}
        className="sw-box"
      >
        <Box onMouseEnter={() => debouncedHoverHandler(hoveredContent)} onMouseLeave={() => debouncedHoverHandler(null)}>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={hoveredContent?.title}
              // @ts-ignore
              addEndListener={(node: any, done: any) => node.addEventListener('transitionend', done, false)}
              classNames="fade"
            >
              <div>
                <Card sx={{ bgcolor: 'text.primary', width: '420px', minHeight: '310px', padding: '30px' }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ boxShadow: 3, bgcolor: 'primary.main', width: 60, height: 60, borderRadius: 0 }} aria-label="recipe">
                        <SvgIcon fontSize="large" component={hoveredContent?.icon} />
                      </Avatar>
                    }
                    titleTypographyProps={{
                      variant: 'h2',
                      color: 'primary.main',
                      sx: { textAlign: 'center', textDecoration: 'underline' },
                    }}
                    title={hoveredContent?.title}
                  />
                  <CardContent>
                    <Typography color="primary.main" variant="subtitle1">
                      {hoveredContent?.description}
                    </Typography>
                  </CardContent>
                </Card>
                {hoveredContent.isDefault && (
                  <SwButton
                    mode="light"
                    label="Activity & Logs"
                    to="/community/town-hall/logs"
                    sx={{ height: '85px', width: '100%', marginTop: '20px' }}
                  />
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
