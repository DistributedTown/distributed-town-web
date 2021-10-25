import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, ThemeOptions, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DitoLogoSvg, SwButton, SwQuote } from 'sw-web-shared';

import { RootState } from '@dito-store/store';

import { ResultState } from '@dito-store/status';
import JoinBaseLayoyt from '../base/join-base';
import { fetchSkills, toggleSkill, updateSkill } from '../store/join.reducer';
import './skills.scss';
import SkillCard from './skill-card';

const Skills = () => {
  const dispatch = useDispatch();
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));
  const { entities, status, selectedSkills, skillSelectedCategory } = useSelector((state: RootState) => state.joinCommunity.skills);
  const { selectedCategory } = useSelector((state: RootState) => state.joinCommunity.category);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== skillSelectedCategory) {
      dispatch(fetchSkills(selectedCategory));
    }
  }, [dispatch, skillSelectedCategory, selectedCategory]);

  return (
    <JoinBaseLayoyt
      status={status}
      className="sw-skill-container"
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
        <div className="sw-skill-wrapper">
          <Typography sx={{ color: 'background.paper', textAlign: 'center', pb: 2 }} component="div" variant="h6">
            Pick your skills (1-to-3) that you want to offer, & recieve the Credits you deserve!
          </Typography>
          {skillSelectedCategory ? (
            entities.map(({ credits, skills, subCat }) => (
              <SkillCard
                key={subCat}
                selectedSkills={selectedSkills}
                category={subCat}
                credits={credits}
                skills={skills}
                updateSkill={(skill) => dispatch(updateSkill(skill))}
                toggleSkill={(skill) => dispatch(toggleSkill(skill))}
              />
            ))
          ) : (
            <Typography
              className="no-item-selected"
              sx={{ color: 'background.paper', textAlign: 'center', pb: 2 }}
              component="div"
              variant="h6"
            >
              No category was selected, go back to select one!
            </Typography>
          )}
        </div>
      }
      prevBtn={<SwButton startIcon={<NavigateBeforeIcon />} component={Link} to="/join-community/categories" label="Prev" />}
      nextBtn={
        <SwButton
          disabled={selectedSkills.length === 0 || status === ResultState.Loading}
          endIcon={<NavigateNextIcon />}
          component={Link}
          to="/join-community/communities"
          label={small ? 'Next' : 'Next: Join your community'}
        />
      }
    />
  );
};

export default Skills;
