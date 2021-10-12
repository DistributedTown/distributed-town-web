import {
  DitoLogoFullSvg,
  SwButton,
  SwScrollbar,
  SwQuote,
} from "sw-web-shared";
import { Box, CircularProgress, List, ListItem } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCategories, selectCategory } from "../store/join.reducer";
import { RootState } from "@dito-store/store";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./categories.scss";
import JoinBaseLayoyt from "../base/join-base";

const Categories = (props) => {
  const largeDevice = useMediaQuery("(min-width: 1280px)");
  const small = useMediaQuery("(max-width: 959px)");

  const dispatch = useDispatch();
  const { entities, status, selected } = useSelector(
    (state: RootState) => state.joinCommunity.category
  );

  useEffect(() => {
    if (!entities.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, entities]);

  return (
    <JoinBaseLayoyt
      left={
        <>
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
                  Distributed Town (DiTo) lets you create or join a community
                  with one click.
                </p>

                <p>
                  Just select what you are best at - and we will match with the
                  best communities that need you the most.
                </p>
              </>
            }
          />
        </>
      }
      right={
        <>
          <Box className="sw-box-categories">
            {status === "loading" ? (
              <CircularProgress sx={{ color: "background.paper" }} />
            ) : (
              <SwScrollbar>
                <List
                  className="category-list-wrapper"
                  sx={{
                    display: "grid",
                    gridGap: "15px",
                    padding: 0,
                    gridTemplateColumns: `repeat(auto-fit, minmax(175px, 1fr))`,
                    gridAutoRows: `minmax(60px, auto)`,
                  }}
                >
                  {entities.map(({ id, name }) => (
                    <ListItem key={id} sx={{ height: "45px" }} disablePadding>
                      <SwButton
                        sx={{
                          height: "100%",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "100%",
                        }}
                        onClick={() => dispatch(selectCategory("Backend"))}
                        className={selected === name ? "active-link" : ""}
                        startIcon={<HelpOutlineIcon />}
                        label={name}
                      />
                    </ListItem>
                  ))}
                </List>
              </SwScrollbar>
            )}
          </Box>
          <Box className="sw-box-actions">
            <div className="next-step">
              <SwButton
                disabled={selected === null || status === "loading"}
                endIcon={<NavigateNextIcon />}
                component={Link}
                to={`/join-community/skills`}
                label="Next: Pick your skills"
              />
            </div>
          </Box>
        </>
      }
    ></JoinBaseLayoyt>
  );
};

export default Categories;
