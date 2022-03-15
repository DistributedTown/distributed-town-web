import { openSnackbar } from '@dito-store/ui-reducer';
import { AxiosResponse } from 'axios';

export const ErrorParser = (error: any, dispatch?: any): string | void => {
  let message = 'Server error';
  try {
    const errResponse = error.response as AxiosResponse<any>;
    if (errResponse && errResponse.status !== 500) {
      message = errResponse.data.error;
    }
  } catch (err) {
    message = 'Server error';
  }

  if (dispatch) {
    dispatch(openSnackbar({ message, severity: 'error' }));
  }
  throw new Error(error);
};

export const ParseSWErrorMessage = (error: any) => {
  if (!error) {
    return error;
  }

  if (error instanceof TypeError) {
    error = error.message;
  }

  if (error?.data?.message) {
    error = error?.data?.message;
  }

  if (typeof error === 'object' && Object.keys(error).length > 0) {
    error = JSON.stringify(error);
  }

  if (typeof error !== 'string') {
    throw new Error('SW smart contract error message is not a string!');
  }

  const [, skillWalletMsg] = error.split('execution reverted:');
  const [, message] = (skillWalletMsg || '').split('SkillWallet:');
  return (message || skillWalletMsg || error || 'Unknown error').trim();
};
