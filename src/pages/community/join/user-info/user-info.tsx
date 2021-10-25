import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, TextField, ThemeOptions, Typography } from '@mui/material';
import { RootState } from '@dito-store/store';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DitoLogoSvg, SwButton, SwQuote, SwUploadFile } from 'sw-web-shared';

import { toBase64 } from '@dito-utils/to-base-64';
import { ResultState } from '@dito-store/status';
import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import JoinBaseLayoyt from '../base/join-base';

import './user-info.scss';

import { updateAvatarUrl, updateName } from '../store/join.reducer';

const UserInfo = () => {
  const largeDevice = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.up('lg'));
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('md'));

  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state: RootState) => state.joinCommunity.userInfo);

  const debouncedChangeHandler = useMemo(() => {
    const changeHandler = (e) => {
      dispatch(updateName(e.target.value));
    };
    return debounce(changeHandler, 300);
  }, [dispatch]);

  useEffect(() => {
    return () => debouncedChangeHandler.cancel();
  }, [debouncedChangeHandler]);

  return (
    <JoinBaseLayoyt
      status={ResultState.Idle}
      className="sw-user-info-container"
      left={
        <>
          <Box className="sw-box-logo">
            <DitoLogoSvg width={largeDevice ? '100px' : '80px'} />
          </Box>

          <SwQuote mobile={small} mobileStartText={<p>Have you ever thought...</p>}>
            <>
              <p>
                Have you ever thought, <br />
                "I would like to contribute, but ..."
              </p>
              <p className="mt-4 mb-4">Distributed Town (DiTo) lets you create or join a community with one click.</p>

              <p>Just select what you are best at - and we will match with the best communities that need you the most.</p>
            </>
          </SwQuote>
        </>
      }
      right={
        <div className="sw-user-info-wrapper">
          <Typography sx={{ color: 'background.paper', textAlign: 'center', pb: 2 }} component="div" variant="h6">
            Personal information
          </Typography>

          <div className="sw-form-field">
            <Typography sx={{ color: 'background.paper', mb: 1 }} component="div" variant="body1">
              Nickname
            </Typography>
            <div className="sw-form-field-content">
              <Typography sx={{ color: 'background.paper' }} component="div" variant="body2">
                How would you like your comminity to call you ?
              </Typography>
              <TextField
                autoFocus
                defaultValue={name}
                inputProps={{ maxLength: 20 }}
                onChange={debouncedChangeHandler}
                helperText={
                  <Typography sx={{ color: 'secondary.main' }} component="span" variant="body2">
                    Max characters 20
                  </Typography>
                }
                variant="standard"
              />
            </div>
          </div>

          <div className="sw-form-field">
            <Typography sx={{ color: 'background.paper', mb: 1 }} component="div" variant="body1">
              Avatar
            </Typography>
            <div className="sw-form-field-content sw-image-upload">
              <Typography sx={{ color: 'background.paper' }} component="div" variant="body2">
                A public image - that's how others will see you.
              </Typography>
              <SwUploadFile
                initialPreviewUrl={avatar}
                fileChange={async (file: File) => {
                  if (file) {
                    const base64 = await toBase64(file);
                    dispatch(updateAvatarUrl(base64));
                  } else {
                    dispatch(updateAvatarUrl(null));
                  }
                }}
                sx={{
                  width: '60px',
                  height: '60px',
                }}
              />
            </div>
          </div>
        </div>
      }
      prevBtn={null}
      nextBtn={
        <SwButton
          endIcon={<NavigateNextIcon />}
          component={Link}
          to="/join-community/categories"
          disabled={!name || !avatar}
          label={small ? 'Next' : 'Next: Pick your category'}
        />
      }
    />
  );
};

export default UserInfo;
