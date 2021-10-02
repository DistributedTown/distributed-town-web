import { Box, Divider } from "@mui/material";
import { DitoLogoSvg, SwButton } from "sw-web-shared";
import { Link } from "react-router-dom";
import "./get-started.scss";

const GetStarted = () => {
  return (
    <div className="sw-get-started-container">
      <Box sx={{ p: 0, m: 0 }} className="sw-box">
        <Box className="sw-box-logo">
          <DitoLogoSvg width="280px" />
        </Box>
        <Box className="sw-box-quote">
          <div className="quote text-white">
            <p>
              <strong>Distributed Town</strong> is a new financial
              infrastructure for public goods, designed for the real world.
            </p>
            <p>
              It’s built upon mutual, collaborative economics between
              individuals and communities - and a universal identity management
              based on skills, rather than personal data.
            </p>
          </div>
        </Box>
      </Box>
      <Divider
        color="white"
        sx={{ width: 4, marginLeft: "40px", marginRight: "40px" }}
        orientation="vertical"
      />
      <Box sx={{ p: 0, m: 0 }} className="sw-box">
        <Box className="sw-box-title">
          <h1 className="text-white text-2xl">
            This is <span className="underline">your Community</span>
          </h1>
        </Box>

        <Box className="sw-box-actions">
          <SwButton label="Create" component={Link} to="/community/create"/>
          <SwButton label="Join" component={Link} to="/community/join"/>
        </Box>
      </Box>
    </div>
  );
};

export default GetStarted;
