import { addLog } from '@dito-store/ui-reducer';
import { requestTimeout } from '@dito-utils/request-timeout';

export const connectToEthereum = async (dispatch?: any): Promise<boolean> => {
  if (!window.ethereum.selectedAddress) {
    try {
      await requestTimeout(window.ethereum.request({ method: 'eth_requestAccounts' }), 20000);
      return true;
    } catch (error) {
      if (dispatch) {
        dispatch(addLog(JSON.stringify(error)));
      }
      return false;
    }
  }
  return true;
};

export const switchToEtheremNetwork = async (dispatch?: any): Promise<boolean> => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13881' }],
    });
  } catch (switchError) {
    if (dispatch) {
      dispatch(addLog(JSON.stringify(switchError)));
    }
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13881', // A 0x-prefixed hexadecimal string
              chainName: 'Mumbai',
              nativeCurrency: {
                name: 'Matic',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://matic-mumbai.chainstacklabs.com', 'https://rpc-mumbai.matic.today'],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            },
          ],
        });
      } catch (error) {
        if (dispatch) {
          dispatch(addLog(JSON.stringify(error)));
        }
        return false;
      }
    }
  }
  return true;
};
