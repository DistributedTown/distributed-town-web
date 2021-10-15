import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, List, ListItem, ThemeOptions, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DitoLogoFullSvg, SwButton, SwQuote } from 'sw-web-shared';

import { RootState } from '@dito-store/store';

import { ResultState } from '@dito-store/status';
import JoinBaseLayoyt from '../base/join-base';
import { fetchCategories, selectCategory } from '../store/join.reducer';

import './categories.scss';

const Categories = () => {
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));

  const dispatch = useDispatch();
  const { entities, status, selectedCategory } = useSelector((state: RootState) => state.joinCommunity.category);

  useEffect(() => {
    if (!entities.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, entities]);

  return (
    <JoinBaseLayoyt
      status={status}
      className="sw-categories-container"
      left={
        <>
          <Box className="sw-box-logo">
            <DitoLogoFullSvg width={largeDevice ? '280px' : '200px'} />
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
            {entities.map(({ id, name }) => (
              <ListItem key={id} sx={{ height: '45px' }} disablePadding>
                <SwButton
                  sx={{
                    height: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                  }}
                  onClick={() => dispatch(selectCategory('Backend'))}
                  className={selectedCategory === name ? 'active-link' : ''}
                  startIcon={<HelpOutlineIcon />}
                  label={name}
                />
              </ListItem>
            ))}
          </List>
        </div>
      }
      prevBtn={null}
      nextBtn={
        <SwButton
          disabled={selectedCategory === null || status === ResultState.Loading}
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
