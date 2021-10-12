import { Badge, Box, Tooltip, Typography } from "@mui/material";
import { DitoLogoFullSvg, SwButton, SwDivider, SwQuote } from "sw-web-shared";
import { Link } from "react-router-dom";
import HelpIcon from "@mui/icons-material/Help";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./get-started.scss";

const GetStarted = () => {
  const largeDevice = useMediaQuery("(min-width: 1280px)");
  const small = useMediaQuery("(max-width: 959px)");
  return (
    <div className="sw-get-started-container">
      <Box sx={{ p: 0, m: 0 }} className="sw-box">
        <Box className="sw-box-logo">
          <DitoLogoFullSvg width={largeDevice ? "280px" : "200px"} />
        </Box>

        <SwQuote
          mobile={small}
          mobileStartText={
            <p>
               is a new financial...
            </p>
          }
          children={
            <>
              <p>
                <strong>Distributed Town</strong> is a new financial
                infrastructure for public goods, designed for the real world.
              </p>
              <p>
                It’s built upon mutual, collaborative economics between
                individuals and communities - and a universal identity
                management based on skills, rather than personal data.
              </p>
            </>
          }
        />
      </Box>
      <SwDivider orientation={largeDevice ? "vertical" : "horizontal"} />
      <Box sx={{ p: 0, m: 0 }} className="sw-box">
        <Box className="sw-box-title">
          <Typography
            color="text.primary"
            component="div"
            variant={largeDevice ? "h4" : "h5"}
          >
            This is <span className="underline">your Community</span>
          </Typography>
        </Box>
        <Box className="sw-box-actions">
          <SwButton
            label="Join a community"
            component={Link}
            to="/join-community"
          />
          <Badge
            badgeContent={
              <Tooltip title="Coming soon!" arrow>
                <HelpIcon
                  sx={{
                    bgcolor: "text.primary",
                    borderRadius: "50%",
                    fontSize: "1.2rem",
                    position: "absolute",
                  }}
                />
              </Tooltip>
            }
          >
            <SwButton
              disabled
              label="Create"
              component={Link}
              to="/community/create"
            />
          </Badge>
        </Box>
      </Box>
    </div>
  );
};

export default GetStarted;
