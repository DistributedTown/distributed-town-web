import {
  DitoLogoFullSvg,
  SwButton,
  SwScrollbar,
  SwDivider,
  SwQuote,
} from "sw-web-shared";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  Slider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./skills.scss";
import { fetchSkills, toggleSkill, updateSkill } from "../store/join.reducer";
import { RootState } from "@dito-store/store";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import useMediaQuery from "@mui/material/useMediaQuery";

const Skills = (props) => {
  const largeDevice = useMediaQuery("(min-width: 1280px)");
  const small = useMediaQuery("(max-width: 959px)");

  const dispatch = useDispatch();
  const { entities, status, selectedSkills } = useSelector(
    (state: RootState) => state.joinCommunity.skills
  );

  const { selected } = useSelector(
    (state: RootState) => state.joinCommunity.category
  );

  useEffect(() => {
    dispatch(fetchSkills(selected));
  }, [dispatch, selected]);

  return (
    <div className="sw-skills-container">
      <Box sx={{ p: 0, m: 0, gridGap: "60px" }} className="sw-box">
        <Box className="sw-box-logo">
          <DitoLogoFullSvg width={largeDevice ? "280px" : "200px"} />
        </Box>
        <SwQuote
          mobile={small}
          mobileStartText={<p>Have you ever thought...</p>}
          children={
            <>
              <p>
                Have you ever thought, <br />
                "I would like to contribute, but ..."
              </p>
              <p className="mt-4 mb-4">
                Distributed Town (DiTo) lets you create or join a community with
                one click.
              </p>

              <p>
                Just select what you are best at - and we will match with the
                best communities that need you the most.
              </p>
            </>
          }
        />
      </Box>
      <SwDivider orientation={largeDevice ? "vertical" : "horizontal"} />
      <Box
        sx={{
          p: 0,
          m: 0,
          gridGap: "20px",
        }}
        className="sw-box"
      >
        <Box className="sw-box-skills">
          {status === "loading" ? (
            <CircularProgress sx={{ color: "background.paper" }} />
          ) : (
            <SwScrollbar>
              <div
                className="skill-card-wrapper"
                style={{
                  display: "grid",
                  gridGap: "15px",
                  padding: 0,
                }}
              >
                <Typography
                  sx={{ color: "background.paper", textAlign: "center" }}
                  component="div"
                  variant="h6"
                >
                  Pick your skills (1-to-3) that you want to offer, & recieve
                  the Credits you deserve!
                </Typography>
                {entities.map(({ credits, skills, subCat }) => (
                  <SkillCard
                    key={subCat}
                    selectedSkills={selectedSkills}
                    category={subCat}
                    credits={credits}
                    skills={skills}
                    updateSkill={(skill) => dispatch(updateSkill(skill))}
                    toggleSkill={(skill) => dispatch(toggleSkill(skill))}
                  />
                ))}
              </div>
            </SwScrollbar>
          )}
        </Box>
        <Box className="sw-box-actions">
          <div className="prev-step">
            <SwButton
              endIcon={<NavigateBeforeIcon />}
              component={Link}
              to={`/join-community/categories`}
              label=""
            />
          </div>
          <div className="next-step">
            <SwButton
              disabled={selected === null || selectedSkills.length === 0}
              endIcon={<NavigateNextIcon />}
              component={Link}
              to={`/join-community/skills`}
              label="Next: Join your community"
            />
          </div>
        </Box>
      </Box>
    </div>
  );
};

function SkillCard({
  category,
  skills,
  credits,
  selectedSkills,
  toggleSkill,
  updateSkill,
}) {
  return (
    <Card className="skill-card" sx={{ display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {category} <small>({credits} Credits)</small>
          </Typography>
        </CardContent>
        <Box
          sx={{ display: "flex", alignItems: "center", pl: "16px", pr: "16px" }}
        >
          <List
            sx={{
              width: "100%",
              display: "grid",
              gridGap: "8px",
              padding: 0,
              gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
              gridAutoRows: `minmax(60px, auto)`,
            }}
          >
            {skills.map((skill: string, index: number) => {
              const currentSkill = selectedSkills.find(
                (x) => x.skill === skill
              );
              return (
                <ListItem
                  key={index}
                  sx={{ minHeight: "45px", alignItems: "flex-start" }}
                  disablePadding
                >
                  <Accordion
                    disableGutters
                    elevation={0}
                    square
                    sx={{ p: 0, m: 0, width: "100%" }}
                    expanded={!!currentSkill}
                  >
                    <AccordionSummary>
                      <SwButton
                        label={skill}
                        sx={{
                          height: "100%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "100%",
                        }}
                        disabled={selectedSkills.length === 3 && !currentSkill}
                        className={currentSkill ? "active-link" : ""}
                        onClick={() => toggleSkill(skill)}
                      />
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: "16px" }}>
                      <Typography
                        color="primary.main"
                        component="div"
                        variant="subtitle1"
                        align="center"
                      >
                        <Badge
                          sx={{
                            padding: "0 8px",
                          }}
                          badgeContent={
                            <Tooltip
                              title="Tell your community about the Experience you have."
                              arrow
                            >
                              <HelpOutlineIcon
                                sx={{
                                  fontSize: "1.2rem",
                                  position: "absolute",
                                }}
                              />
                            </Tooltip>
                          }
                        >
                          Your XP Level
                        </Badge>
                      </Typography>

                      <Stack
                        spacing={2}
                        direction="row"
                        sx={{ mb: 1 }}
                        alignItems="center"
                      >
                        <Typography
                          color="primary.main"
                          component="div"
                          variant="subtitle2"
                        >
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
                            "& .MuiSlider-thumb": {
                              borderRadius: "0px",
                            },
                          }}
                        />
                        <Typography
                          color="primary.main"
                          component="div"
                          variant="subtitle2"
                        >
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

export default Skills;
