import { Controller, useFieldArray, useForm } from 'react-hook-form';
import './new-gig.scss';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, TextField, Typography } from '@mui/material';
import { SwButton, SwSlider } from 'sw-web-shared';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import ErrorDialog from '@dito-components/ErrorPopup';
import LoadingDialog from '@dito-components/LoadingPopup';
import { ResultState } from '@dito-store/status';
import SkillsForm from './skills-form';
import { CommunityCategories } from '../../store/community.reducer';
import { createGig, GigErrorMessage, GigState, GigStatus, updateGigStatus } from '../../store/gigs.reducer';
import { OnCreateGigHandlers } from './create-gig-handlers';
import { CreateGigErrorTypes } from '../../join/store/model';

const countWords = (value: string) => (value || '').split(' ').filter((x) => !!x).length;

function FormHelperText({ errors, name, children, value }) {
  if (errors[name]) {
    let message = '';
    const { type } = errors[name];
    switch (type) {
      case 'maxWords':
        message = `Words cannot be more than 6`;
        break;
      case 'maxLength':
        message = `Characters cannot be more than 280`;
        break;
      case 'required':
        message = 'Field is required!';
        break;
      default:
        return null;
    }
    return (
      <Typography whiteSpace="nowrap" color="red" align="right" component="span" variant="body2">
        {message}
      </Typography>
    );
  }
  return (
    <Typography color="primary" align="right" component="span" variant="body2">
      {children}
    </Typography>
  );
}

const NewGig = () => {
  const handleClick = () => {
    return null;
  };
  const dispatch = useDispatch();
  const [dialogContent, setDialogContent] = useState(null);
  const [open, setOpen] = useState(false);

  const handleDialogClose = (closeStatus: 'close' | 'retry' = null) => {
    dispatch(updateGigStatus(ResultState.Idle));
  };

  const communityCategories = useSelector(CommunityCategories);
  const status = useSelector(GigStatus);
  const errorMessage = useSelector(GigErrorMessage);

  const handleChange = () => {
    return null;
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: null,
      description: null,
      commitment: null,
      credits: null,
      categories: communityCategories,
    },
  });
  const values = watch();
  const { fields } = useFieldArray({
    control,
    name: 'categories',
  });

  const postGig = async (data) => {
    const { categories, commitment, ...rest } = data;

    const skills = categories.reduce((prev, curr) => {
      const selectedSkills = curr.skills.filter((skill) => skill.selected).map((item) => ({ name: item.name }));
      return [...prev, ...selectedSkills];
    }, []);
    const metadataJson: any = {
      ...rest,
      properties: {
        skills,
        commitment,
      },
    };

    dispatch(createGig(metadataJson));
    console.log(metadataJson, '========================');

    // const { onEthConnection, onEthNetworkChange, onIPFS, onCreateGig } = OnCreateGigHandlers(
    //   dispatch,
    //   setDialogContent,
    //   handleClose,
    //   async (message: CreateGigErrorTypes) => {
    //     let tokenId = null;
    //     // let nonce = null;
    //     // let active = false;

    //     /*
    //     Step 1 - Connect to ethereum / metamask
    // */
    //     const isConnected = await onEthConnection();
    //     console.log('IsConnected: ', isConnected);

    //     /*
    //     Step 2 - Change to correct ethereum network
    // */
    //     const isCorrectNetwork = await onEthNetworkChange(isConnected);
    //     console.log('IsCorrectNetwork: ', isConnected);

    //     /*
    //     Step 3 - Store image & join community flow metadata to textile bucket
    // */
    //     const ipfsUrl = await onIPFS(isCorrectNetwork, metadataJson);
    //     console.log('ipfsUrl: ', ipfsUrl);

    //     /*
    //     Step 4 - Execute join membership smart contract
    // */

    //     /*
    //     Step 5 - Execute claim membership smart contract
    // */

    //     /*
    //     Step 6 - Generate nonce & show qr code
    // */
    //     // const nonce = await onQRCodeGenerate(tokenId);
    //     // console.log('Nonce: ', nonce);

    //     /*
    //     Step 7 - poll to check if qr code was used/activate
    // */
    //     // const active = await isQrCodeActivated(tokenId);
    //     // console.log('IsQrCodeActivated: ', active);

    //     /*
    //     Step 8 - Go to success screen
    // */
    //     // goToSuccessScreen(active);
    //   }
    // );
  };

  const getColor = (value: number): string => {
    if (+value === 5) {
      return 'text.secondary';
    }
    if (+value < 5) {
      return 'primary.main';
    }
    return 'background.paper';
  };

  return (
    <>
      <ErrorDialog
        hasRetry
        mode="dark"
        handleClose={handleDialogClose}
        open={status === ResultState.Failed}
        message={errorMessage || 'Something went wrong'}
      />
      <LoadingDialog mode="dark" handleClose={handleDialogClose} open={status === ResultState.Loading} message="Posting gig..." />
      <form className="sw-new-gig" onSubmit={handleSubmit(postGig)}>
        <Typography lineHeight="1" sx={{ mb: '60px', textDecoration: 'underline' }} component="div" variant="h1">
          Create New Gig
        </Typography>
        <div className="sw-form-field">
          <Typography color="background.paper" sx={{ mb: '5px' }} component="div" variant="h3">
            Title
          </Typography>
          <Typography color="text.secondary" sx={{ mb: '15px' }} component="div" variant="body2">
            Hint: a short, clear title will catch contributors’ attention. Just be honest please.
          </Typography>
          <div className="sw-form-field-content">
            <Controller
              name="name"
              control={control}
              rules={{
                required: true,
                validate: {
                  maxWords: (v: string) => countWords(v) <= 6,
                },
              }}
              render={({ field: { name, value, onChange }, fieldState }) => {
                return (
                  <TextField
                    required
                    autoFocus
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    sx={{
                      '.MuiInputBase-input': {
                        height: '35px',
                        p: 0,
                        color: 'black',
                        '&::placeholder': {
                          opacity: 1,
                          color: '#707070',
                        },
                        '&::-webkit-input-placeholder': {
                          color: '#707070',
                          opacity: 1,
                        },
                        '&::-moz-placeholder': {
                          color: '#707070',
                          opacity: 1,
                        },
                      },
                    }}
                    helperText={
                      <FormHelperText value={value} name={name} errors={errors}>
                        {6 - countWords(value)} Words left
                      </FormHelperText>
                    }
                  />
                );
              }}
            />
          </div>
        </div>

        <div className="sw-form-field">
          <Typography color="background.paper" sx={{ mb: '5px' }} component="div" variant="h3">
            Description
          </Typography>
          <Typography color="text.secondary" sx={{ mb: '15px' }} component="div" variant="body2">
            Hint: be as detailed as possible, and be nice - there are real people on the other side :)!{' '}
          </Typography>
          <div className="sw-form-field-content">
            <Controller
              name="description"
              control={control}
              rules={{ required: true, maxLength: 280 }}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <TextField
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    color="primary"
                    sx={{
                      '.MuiInputBase-input': {
                        p: 0,
                        color: 'black',
                        '&::placeholder': {
                          color: '#707070',
                          opacity: 1,
                        },
                        '&::-webkit-input-placeholder': {
                          color: '#707070',
                          opacity: 1,
                        },
                        '&::-moz-placeholder': {
                          color: '#707070',
                          opacity: 1,
                        },
                      },
                    }}
                    multiline
                    rows={5}
                    required
                    helperText={
                      <FormHelperText value={value} name={name} errors={errors}>
                        {280 - (value?.length || 0)} of 280 characters left
                      </FormHelperText>
                    }
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="sw-form-field">
          <Typography color="background.paper" sx={{ mb: '5px' }} component="div" variant="h3">
            Skills needed
          </Typography>
          <Typography color="text.secondary" sx={{ mb: '15px' }} component="div" variant="body2">
            Hint: If it requires many different skills, consider creating 2 separate gigs, or start a new project.
          </Typography>
        </div>
        <Accordion
          key="acc-skills"
          disableGutters
          elevation={0}
          square
          sx={{
            p: 0,
            mt: 0,
            width: '100%',
            boxShadow: 4,
            border: '3px solid white',
            backgroundColor: 'transparent',
            '.MuiAccordionSummary-root': {
              minHeight: '43px',
            },
          }}
          onChange={handleChange}
        >
          <AccordionSummary
            sx={{ m: 0, height: '43px', display: 'flex' }}
            expandIcon={<ExpandMoreIcon sx={{ color: 'background.paper' }} />}
          >
            {communityCategories.map(({ name }) => (
              <Typography
                key={`category-label-key-${name}`}
                sx={{ ml: 1, width: '33%' }}
                component="span"
                variant="subtitle1"
                align="center"
                color="background.paper"
              >
                {name}
              </Typography>
            ))}
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <div className="sw-accordion-summary-wrapper">
              {fields.map((item, index) => {
                return (
                  <div key={`category-key-${index}`} className="sw-options-wrapper">
                    <SkillsForm values={values} control={control} errors={errors} categoryIndex={index} />
                  </div>
                );
              })}
            </div>
          </AccordionDetails>
        </Accordion>

        <div style={{ display: 'flex' }}>
          <div
            className="sw-slider-field"
            style={{
              width: '50%',
            }}
          >
            <Typography color="background.paper" sx={{ mb: '5px' }} component="div" variant="h3">
              Commitment
            </Typography>
            <Typography color="text.secondary" sx={{ mb: '15px' }} component="div" variant="body2">
              Hint: the effort needed for this task. This value influences the DiTo set as a reward for your gig!
            </Typography>
            <div className="commitment-level">
              <Controller
                name="commitment"
                control={control}
                rules={{ min: 1, required: true }}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <div>
                      <div style={{ position: 'relative' }}>
                        <SwSlider
                          className="sw-slider"
                          variant="filled"
                          mode="white"
                          name={name}
                          value={value || 0}
                          onChange={onChange}
                          min={0}
                          max={10}
                        />
                        <Typography
                          sx={{
                            position: 'absolute',
                            transform: 'translate(-50%, -50%)',
                            left: '50%',
                            top: '50%',
                          }}
                          color={getColor(value)}
                          variant="body1"
                        >
                          {value}
                        </Typography>
                      </div>
                      <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="background.paper" variant="body1">
                          0
                        </Typography>
                        <Typography color="background.paper" variant="body1">
                          10
                        </Typography>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
          <div
            style={{
              width: '50%',
              marginTop: '15px',
              marginLeft: '20px',
            }}
          >
            <Typography color="background.paper" sx={{ mb: '5px' }} component="div" variant="h3">
              Budget
            </Typography>
            <Typography color="text.secondary" sx={{ mb: '15px' }} component="div" variant="body2">
              Hint: the amount of DITO you need for this gig.
            </Typography>

            <div className="sw-form-field-content">
              <Controller
                name="credits"
                control={control}
                rules={{ required: true, maxLength: 280 }}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <TextField
                      name={name}
                      value={value || ''}
                      onChange={onChange}
                      type="number"
                      color="primary"
                      sx={{
                        '.MuiInputBase-input': {
                          p: 0,
                          color: 'black',
                          '&::placeholder': {
                            color: '#707070',
                            opacity: 1,
                          },
                          '&::-webkit-input-placeholder': {
                            color: '#707070',
                            opacity: 1,
                          },
                          '&::-moz-placeholder': {
                            color: '#707070',
                            opacity: 1,
                          },
                        },
                      }}
                      required
                      focused
                      helperText={
                        <FormHelperText value={value} name={name} errors={errors}>
                          DITO Credits
                        </FormHelperText>
                      }
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="sw-post-button-wrapper">
          <SwButton type="submit" sx={{ width: '310px', height: '50px' }} mode="light" label="Post your Gig!" />
        </div>
      </form>
    </>
  );
};

export default NewGig;
