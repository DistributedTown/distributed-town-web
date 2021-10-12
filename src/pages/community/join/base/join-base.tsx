import { SwDivider } from "sw-web-shared";
import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./join-base.scss";

const JoinBaseLayoyt = ({
  left,
  right,
}: {
  left: JSX.Element;
  right: JSX.Element;
}) => {
  const largeDevice = useMediaQuery("(min-width: 1280px)");
  return (
    <div className="sw-join-base-container">
      <Box
        sx={{
          p: 0,
          m: 0,
          gridGap: "60px",
        }}
        className="sw-box"
      >
        {left}
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
        {right}
      </Box>
    </div>
  );
};

export default JoinBaseLayoyt;
