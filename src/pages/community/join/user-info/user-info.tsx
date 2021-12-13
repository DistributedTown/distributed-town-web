import { TextField, Typography } from '@mui/material';
import { RootState } from '@dito-store/store.model';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SwButton, SwQuote, SwUploadFile, toBase64 } from 'sw-web-shared';
import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import './user-info.scss';

import SwForm from '@dito-components/form-components/SwForm';
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
  const [userInfo] = useState(useSelector((state: RootState) => state.joinCommunity.userInfo));

  const changeHandler = async ({ values: { avatar, name } }) => {
    if (name !== userInfo?.name) {
      dispatch(updateName(name));
    }

    if (avatar !== userInfo?.avatar) {
      if (avatar && typeof avatar !== 'string') {
        const base64 = await toBase64(avatar);
        dispatch(updateAvatarUrl(base64));
      } else {
        dispatch(updateAvatarUrl(null));
      }
    }
  };

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
  }, [dispatch, activeStep]);

  return (
    <div className="sw-user-info-wrapper">
      <SwForm changeHandler={changeHandler} initialValues={userInfo}>
        {({ values }) => {
          return (
            <>
              <div className="sw-form-field">
                <Typography sx={{ color: 'text.primary', mb: '4px' }} component="div" variant="h3">
                  Nickname
                </Typography>
                <Typography sx={{ color: 'text.primary', mb: '12px' }} component="div" variant="body2">
                  What would you like your community to call you?
                </Typography>
                <div className="sw-form-field-content">
                  <Field
                    name="name"
                    render={(props) => {
                      return (
                        <TextField
                          name={props.input.name}
                          value={props.input.value}
                          onChange={props.input.onChange}
                          autoFocus
                          required
                          focused
                          error={props.meta.touched && props.meta.pristine && !props.input.value}
                          color="secondary"
                          placeholder="Required Field"
                          inputProps={{ maxLength: 20 }}
                          helperText={
                            <Typography sx={{ color: 'text.primary' }} align="right" component="span" variant="body2">
                              Max characters {20 - (props.input.value?.length || 0)}
                            </Typography>
                          }
                        />
                      );
                    }}
                  />
                </div>
              </div>

              <div className="sw-form-field">
                <Typography sx={{ color: 'text.primary', mb: '4px' }} component="div" variant="h3">
                  Avatar
                </Typography>
                <Typography sx={{ color: 'text.primary', mb: '12px' }} component="div" variant="body2">
                  A public image - that's how others will see you.
                </Typography>
                <div className="sw-form-field-content sw-image-upload">
                  <div className="sw-field-upload">
                    <div>
                      <Field
                        name="avatar"
                        render={(props) => {
                          return (
                            <SwUploadFile
                              name={props.input.name}
                              initialPreviewUrl={props.input.value}
                              fileChange={props.input.onChange}
                              sx={{
                                width: '110px',
                                height: '110px',
                              }}
                            />
                          );
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
                <SwButton
                  type="button"
                  disabled={!values?.name || !values?.avatar}
                  component={Link}
                  to="/join-community/skills"
                  label="Next: Pick your Skills"
                />
              </div>
            </>
          );
        }}
      </SwForm>
    </div>
  );
};

export default UserInfo;
