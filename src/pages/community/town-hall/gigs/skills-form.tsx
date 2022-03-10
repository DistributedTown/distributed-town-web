/* eslint-disable react/no-unstable-nested-components */
import { Card, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { Controller, useFieldArray } from 'react-hook-form';

function FormHelperText({ errors, name, children = null, value }) {
  if (errors[name]) {
    let message = '';
    const { type } = errors[name];
    switch (type) {
      case 'required':
        message = 'Field is required!';
        break;
      case 'min':
        message = 'Min 1 commitment level!';
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
    children && (
      <Typography color="primary" align="right" component="span" variant="body2">
        {children}
      </Typography>
    )
  );
}

const SkillsForm = ({ values, control, errors, categoryIndex }) => {
  const { fields } = useFieldArray({
    control,
    name: `categories[${categoryIndex}].skills`,
  });

  return (
    <>
      {fields.map((item: any, index) => (
        <Controller
          key={`categories[${categoryIndex}].skills[${index}].name`}
          name={`categories[${categoryIndex}].skills[${index}].selected`}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <FormControlLabel
                label={
                  <Typography component="span" variant="body1" color="background.paper">
                    {item.name}
                  </Typography>
                }
                control={
                  <Checkbox
                    sx={{
                      color: 'background.paper',
                      '&.Mui-checked': {
                        color: 'background.paper',
                      },
                    }}
                    checked={value}
                    onChange={onChange}
                  />
                }
              />
            );
          }}
        />
      ))}
    </>
  );
};

export default SkillsForm;
