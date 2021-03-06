import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SwButton } from 'sw-web-shared';
import { RootState } from '@dito-store/store.model';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SwForm from '@dito-components/form-components/SwForm';
import { ResultState } from '@dito-store/status';
import { fetchSkills, setCurrentStep, updateSkill } from '../store/join.reducer';
import SkillCard from './skill-card';
import './skills.scss';

const Skills = () => {
  const dispatch = useDispatch();
  const { activeStep } = useSelector((state: RootState) => state.joinCommunity.currentStep);
  const { entities, status, skillSelectedCategory } = useSelector((state: RootState) => state.joinCommunity.skills);
  const { selectedCategory } = useSelector((state: RootState) => state.joinCommunity.category);
  const [expanded, setExpanded] = useState<number | false>(false);
  const [selectedSkills] = useState(useSelector((state: RootState) => state.joinCommunity.skills.selectedSkills));

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const changeHandler = async (values) => {
    console.log(values);
  };

  useEffect(() => {
    if (selectedCategory && selectedCategory !== skillSelectedCategory) {
      dispatch(fetchSkills(selectedCategory));
    }
  }, [dispatch, skillSelectedCategory, selectedCategory]);

  useEffect(() => {
    if (activeStep !== 1) {
      dispatch(
        setCurrentStep({
          activeStep: 1,
          stepperText: 'Welcome to Distributed Town',
          title: 'Step 2 - Pick your Skills',
          description: 'Pick your skills (1-to-3) that you want to offer, & recieve the Credits you deserve!',
          toPrevBtnPath: '/join-community/user-info',
          descriptionTooltip: 'Tell your community about the Experience you have.',
        })
      );
    }
  }, [dispatch, activeStep]);

  return (
    <SwForm
      changeHandler={changeHandler}
      initialValues={selectedSkills.reduce((prev, curr) => {
        prev[curr?.skill] = curr?.xp || 0;
        return prev;
      }, {})}
    >
      {({ values }) => {
        const totalSkills = Object.keys(values)
          .filter((key) => values[key] !== 0)
          .map((skill) => ({ skill }));
        const maxSkillsSelected = totalSkills.length === 3;

        return status === ResultState.Loading ? (
          <CircularProgress sx={{ color: 'text.primary', mt: 2 }} />
        ) : (
          <>
            <div className="sw-skill-wrapper">
              {skillSelectedCategory ? (
                !entities?.length ? (
                  <Typography sx={{ color: 'text.secondary', textAlign: 'center', pb: 2, mt: 4 }} component="div" variant="body1">
                    We could not find any skills for {skillSelectedCategory} category, please go back and select a different category!
                  </Typography>
                ) : (
                  entities.map(({ credits, skills, subCat }, index: number) => {
                    const areSkillSelectedWithinGroup = totalSkills.some(({ skill }) => skills.indexOf(skill) !== -1);
                    return (
                      <Accordion
                        key={`acc-${index}`}
                        disableGutters
                        elevation={0}
                        disabled={!areSkillSelectedWithinGroup && maxSkillsSelected}
                        square
                        expanded={expanded === index}
                        sx={{
                          p: 0,
                          mt: 3,
                          width: '100%',
                          '.MuiAccordionSummary-root': {
                            minHeight: '43px',
                          },
                        }}
                        onChange={handleChange(index)}
                      >
                        <AccordionSummary sx={{ m: 0, height: '43px' }} expandIcon={<ExpandMoreIcon />}>
                          <Typography
                            sx={{ m: 0, lineHeight: '43px' }}
                            component="div"
                            variant="h3"
                            color={expanded === index ? 'text.primary' : 'primary.main'}
                          >
                            {subCat}
                            <Typography sx={{ ml: 1 }} component="span" variant="subtitle1" color="info.dark">
                              <small>({credits} Credits)</small>
                            </Typography>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          {expanded === index && (
                            <SkillCard
                              key={subCat}
                              state={values}
                              totalSkills={totalSkills}
                              skills={skills}
                              updateSkill={(skill) => dispatch(updateSkill(skill))}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })
                )
              ) : (
                <Typography
                  className="no-item-selected"
                  sx={{ color: 'text.secondary', textAlign: 'center', pb: 2 }}
                  component="div"
                  variant="body1"
                >
                  No category was selected, go back to select one!
                </Typography>
              )}
            </div>
            <div className="bottom-action">
              <SwButton
                mode="light"
                btnType="large"
                disabled={totalSkills?.length === 0 || status === ResultState.Loading}
                component={Link}
                to="/join-community/communities"
                label="Next: Claim your Memebership!"
              />
            </div>
          </>
        );
      }}
    </SwForm>
  );
};

export default Skills;
