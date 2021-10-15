import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Tooltip,
  Stack,
  Slider,
  Box,
} from '@mui/material';
import { SwButton } from 'sw-web-shared';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import './skill-card.scss';

function SkillCard({ category, skills, credits, selectedSkills, toggleSkill, updateSkill }) {
  return (
    <Card className="sw-skill-card" sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6">
            {category} <small>({credits} Credits)</small>
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            pl: '16px',
            pr: '16px',
          }}
        >
          <List className="sw-skill-list">
            {skills.map((skill: string, index: number) => {
              const currentSkill = selectedSkills.find((x) => x.skill === skill);
              return (
                <ListItem key={index} sx={{ minHeight: '45px', alignItems: 'flex-start' }} disablePadding>
                  <Accordion disableGutters elevation={0} square sx={{ p: 0, m: 0, width: '100%' }} expanded={!!currentSkill}>
                    <AccordionSummary>
                      <SwButton
                        label={skill}
                        sx={{
                          height: '100%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                        }}
                        disabled={selectedSkills.length === 3 && !currentSkill}
                        className={currentSkill ? 'active-link' : ''}
                        onClick={() => toggleSkill(skill)}
                      />
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: '16px' }}>
                      <Typography color="primary.main" component="div" variant="subtitle1" align="center">
                        <Badge
                          sx={{
                            padding: '0 8px',
                          }}
                          badgeContent={
                            <Tooltip title="Tell your community about the Experience you have." arrow>
                              <HelpOutlineIcon
                                sx={{
                                  fontSize: '1.2rem',
                                  position: 'absolute',
                                }}
                              />
                            </Tooltip>
                          }
                        >
                          Your XP Level
                        </Badge>
                      </Typography>

                      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <Typography color="primary.main" component="div" variant="subtitle2">
                          1
                        </Typography>
                        <Slider
                          key={`slider-${currentSkill?.xp}`}
                          valueLabelDisplay="auto"
                          step={1}
                          marks
                          min={1}
                          max={10}
                          defaultValue={currentSkill?.xp}
                          onChangeCommitted={(_, value: number) => {
                            updateSkill({
                              xp: value,
                              skill,
                            });
                          }}
                          sx={{
                            '& .MuiSlider-thumb': {
                              borderRadius: '0px',
                            },
                          }}
                        />
                        <Typography color="primary.main" component="div" variant="subtitle2">
                          10
                        </Typography>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
    </Card>
  );
}

export default SkillCard;
