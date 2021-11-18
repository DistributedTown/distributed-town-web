import { TextField, Typography } from '@mui/material';
import { RootState } from '@dito-store/store.model';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SwButton, SwQuote, SwUploadFile } from 'sw-web-shared';

import { toBase64 } from '@dito-utils/to-base-64';
import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';

import './user-info.scss';

import { setCurrentStep, updateAvatarUrl, updateName } from '../store/join.reducer';

const LeftSide = () => (
  <SwQuote key="user-info-1">
    <>
      <Typography sx={{ color: 'text.primary', mb: 1 }} component="div" variant="h6" align="center">
        <p>Welcome to Distributed Town 🏙</p>
      </Typography>

      <p>
        Distributedd town is a fully pseudonymous, skill-based ecosystem. <br />
      </p>
      <p className="mt-4 mb-4">
        In the next several steps you’ll be customizing your profile, picking your skills, and receiving your first Community Credits 🙌
      </p>

      <p>Have fun, and enjoy your first universal citizenship 😎</p>
    </>
  </SwQuote>
);

const UserInfo = () => {
  const dispatch = useDispatch();
  const { activeStep } = useSelector((state: RootState) => state.joinCommunity.currentStep);
  const { name, avatar } = useSelector((state: RootState) => state.joinCommunity.userInfo);

  const debouncedChangeHandler = useMemo(() => {
    const changeHandler = (e) => {
      dispatch(updateName(e.target.value));
    };
    return debounce(changeHandler, 10);
  }, [dispatch]);

  useEffect(() => {
    if (activeStep !== 0) {
      dispatch(
        setCurrentStep({
          activeStep: 0,
          title: 'Step 1 - Tell us about you',
          description: 'Lorem consetetur sadipscing elitr, sed diam nonumy eirmod',
          toPrevBtnPath: '/join-community/categories',
          left: LeftSide,
        })
      );
    }

    return () => debouncedChangeHandler.cancel();
  }, [debouncedChangeHandler, dispatch, activeStep]);

  return (
    <div className="sw-user-info-wrapper">
      <div className="sw-form-field">
        <Typography sx={{ color: 'text.primary', mb: '4px' }} fontWeight="bold" component="div" variant="body1">
          Nickname
        </Typography>
        <Typography sx={{ color: 'text.primary', mb: '4px' }} component="div" variant="body2">
          What would you like your community to call you?
        </Typography>
        <div className="sw-form-field-content">
          <TextField
            autoFocus
            focused
            color="secondary"
            placeholder="Required Field"
            defaultValue={name}
            inputProps={{ maxLength: 20 }}
            onChange={debouncedChangeHandler}
            helperText={
              <Typography sx={{ color: 'text.primary' }} align="right" component="span" variant="body2">
                Max characters {20 - (name?.length || 0)}
              </Typography>
            }
          />
        </div>
      </div>

      <div className="sw-form-field">
        <Typography sx={{ color: 'text.primary', mb: '4px' }} fontWeight="bold" component="div" variant="body1">
          Avatar
        </Typography>
        <Typography sx={{ color: 'text.primary', mb: '4px' }} component="div" variant="body2">
          A public image - that's how others will see you.
        </Typography>
        <div className="sw-form-field-content sw-image-upload">
          <div className="sw-field-upload">
            <div>
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
                  width: '110px',
                  height: '110px',
                }}
              />
              <Typography sx={{ color: 'text.primary' }} align="right" component="div" variant="body2">
                .png or .jpg
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-action">
        <SwButton disabled={!name || !avatar} component={Link} to="/join-community/skills" label="Next: Pick your Skills" />
      </div>
    </div>
  );
};

export default UserInfo;
