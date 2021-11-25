import { Card, CardContent, Typography, List, ListItem, Stack } from '@mui/material';
import { SwSlider } from 'sw-web-shared';
import './skill-card.scss';
import { toPascalCase } from '@dito-utils/pascal-case';
import { CategoryIcons } from '../categories/categories';

function SkillCard({ skills, selectedSkills, updateSkill }) {
  return (
    <Card className="sw-skill-card" sx={{ display: 'flex', boxShadow: 0, backgroundColor: 'transparent' }}>
      <CardContent sx={{ flex: '1 0 auto', width: '100%', p: '16px' }}>
        <List className="sw-skill-list">
          {skills.map((skill: string, index: number) => {
            const currentSkill = selectedSkills.find((x) => x.skill === skill);
            const disabled = !currentSkill && selectedSkills.length === 3;
            const isActive = currentSkill?.xp > 0;
            const SwIcon = CategoryIcons[toPascalCase(skill)];
            return (
              <ListItem
                key={index}
                disabled={disabled}
                sx={{
                  height: '50px',
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
                  <SwIcon className={`sw-skill-icon ${isActive ? 'active' : ''}`} height="26px" />
                  <Typography
                    sx={{ width: '100%', ml: '14px' }}
                    color={isActive ? 'text.primary' : 'primary.main'}
                    component="div"
                    variant="subtitle2"
                    align="left"
                  >
                    {skill}
                  </Typography>
                  <SwSlider
                    key={`slider-${currentSkill?.xp}`}
                    step={1}
                    mode={isActive ? 'white' : 'black'}
                    marks
                    min={0}
                    max={10}
                    disabled={disabled}
                    defaultValue={currentSkill?.xp || 0}
                    onChangeCommitted={(_, value: number) => {
                      updateSkill({
                        xp: value,
                        skill,
                      });
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
