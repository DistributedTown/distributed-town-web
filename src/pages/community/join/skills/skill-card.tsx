import { Card, CardContent, Typography, List, ListItem, Stack } from '@mui/material';
import { SwSlider, toPascalCase } from 'sw-web-shared';
import { Field } from 'react-final-form';
import { CategoryIcons } from '../categories/categories';

import './skill-card.scss';

function SkillCard({ skills, state, updateSkill, totalSkills }) {
  return (
    <Card className="sw-skill-card" sx={{ display: 'flex', boxShadow: 0, backgroundColor: 'transparent' }}>
      <CardContent sx={{ flex: '1 0 auto', width: '100%', p: '16px' }}>
        <List className="sw-skill-list">
          {skills.map((skill: string, index: number) => {
            const currentSkill = state[skill];
            const disabled = (!currentSkill || currentSkill === 0) && totalSkills?.length === 3;
            const isActive = currentSkill > 0;
            const SwIcon = CategoryIcons[toPascalCase(skill)];

            return (
              <ListItem
                key={index}
                disabled={disabled}
                sx={{
                  height: '48px',
                  opacity: 1,
                  alignItems: 'center',
                  borderColor: isActive ? 'background.paper' : 'primary.main',
                  bgcolor: disabled ? 'currentColor' : isActive ? 'primary.main' : 'background.paper',
                  boxShadow: isActive ? 1 : 0,
                  '&.Mui-disabled': {
                    opacity: 1,
                  },
                }}
              >
                <Stack sx={{ width: '100%' }} direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                  {SwIcon === undefined ? (
                    <div className="sw-skill-icon" />
                  ) : (
                    <SwIcon className={`sw-skill-icon ${isActive ? 'active' : ''}`} height="18px" />
                  )}
                  <Typography
                    sx={{ width: '100%', ml: '14px' }}
                    color={isActive ? 'text.primary' : 'primary.main'}
                    component="div"
                    variant="subtitle2"
                    align="left"
                  >
                    {skill}
                  </Typography>
                  <Field
                    name={skill}
                    render={(props) => {
                      return (
                        <SwSlider
                          name={skill}
                          value={props.input.value || 0}
                          onChange={props.input.onChange}
                          onChangeCommitted={(_, value: number) => {
                            updateSkill({
                              xp: value,
                              skill,
                            });
                          }}
                          step={1}
                          mode={isActive ? 'white' : 'black'}
                          marks
                          min={0}
                          max={10}
                          disabled={disabled}
                        />
                      );
                    }}
                  />
                </Stack>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}

export default SkillCard;
