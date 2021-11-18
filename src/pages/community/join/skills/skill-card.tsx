import { Card, CardContent, Typography, List, ListItem, Badge, Tooltip, Stack } from '@mui/material';
import { SwSlider } from 'sw-web-shared';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import './skill-card.scss';

function SkillCard({ skills, selectedSkills, updateSkill, expanded }) {
  return (
    <Card className="sw-skill-card" sx={{ display: 'flex', boxShadow: 0, backgroundColor: 'transparent' }}>
      <CardContent sx={{ flex: '1 0 auto', width: '100%', p: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: '1' }} />
          <Typography
            sx={{ flex: '1', display: 'flex', justifyContent: 'center', mb: 2 }}
            color={expanded ? 'text.primary' : 'primary.main'}
            component="div"
            variant="body2"
            align="right"
          >
            <Badge
              sx={{
                padding: '0 8px',
              }}
              badgeContent={
                <Tooltip title="Tell your community about the Experience you have." arrow>
                  <HelpOutlineIcon
                    sx={{
                      fontSize: '1rem',
                      position: 'absolute',
                    }}
                  />
                </Tooltip>
              }
            >
              Select your XP Level
            </Badge>
          </Typography>
        </div>
        <List className="sw-skill-list">
          {skills.map((skill: string, index: number) => {
            const currentSkill = selectedSkills.find((x) => x.skill === skill);
            const disabled = !currentSkill && selectedSkills.length === 3;
            const isActive = currentSkill?.xp > 0;
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
                  <Typography
                    sx={{ width: '100%' }}
                    color={isActive ? 'text.primary' : 'primary.main'}
                    component="div"
                    variant="body1"
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
