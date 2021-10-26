import { ResultState } from '@dito-store/status';
import { Box, CircularProgress, ThemeOptions } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SwDivider, SwScrollbar } from 'sw-web-shared';
import './join-base.scss';

const JoinBaseLayoyt = ({
  left,
  right,
  prevBtn,
  nextBtn,
  status,
  className,
}: {
  left: JSX.Element;
  right: JSX.Element;
  prevBtn: JSX.Element;
  nextBtn: JSX.Element;
  className: string;
  status: ResultState;
}) => {
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));

  return (
    <div className={`sw-join-base-container ${className}`}>
      <Box
        sx={{
          p: 0,
          m: 0,
          gridGap: '60px',
        }}
        className="sw-box"
      >
        {left}
      </Box>
      <SwDivider orientation={largeDevice ? 'vertical' : 'horizontal'} />
      <Box
        sx={{
          p: 0,
          m: 0,
          gridGap: '20px',
        }}
        className="sw-box"
      >
        <Box sx={{ width: largeDevice ? '90% !important' : '100%' }} className="sw-box-right-inner">
          {status === ResultState.Loading ? (
            <CircularProgress sx={{ color: 'background.paper' }} />
          ) : !largeDevice ? (
            right
          ) : (
            <SwScrollbar>{right}</SwScrollbar>
          )}
        </Box>
        <Box
          sx={{ width: largeDevice ? 'calc(90% - 12px) !important' : '100%', boxShadow: !largeDevice ? 2 : 0 }}
          className="sw-box-actions"
        >
          <div className="prev-step">{prevBtn}</div>
          <div className="next-step">{nextBtn}</div>
        </Box>
      </Box>
    </div>
  );
};

export default JoinBaseLayoyt;
