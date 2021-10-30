import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@dito-store/store.model';
import { setUserAddress, setWeb3jsInstance } from './auth.reducer';

const Web3jsComponent = ({ children }) => {
  const { active, connector } = useWeb3React();
  const dispatch = useAppDispatch();
  const { web3jsInstance } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    connector
      ?.getProvider()
      .then((provider) => {
        const instance = new Web3(provider);
        dispatch(setWeb3jsInstance(instance));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [active, connector, dispatch]);

  useEffect(() => {
    if (web3jsInstance === null) {
      return;
    }

    console.log('web3jsInstance listener');
    (web3jsInstance as Web3).eth.getAccounts((err, accounts: string[]) => {
      if (err) {
        console.error(err);
      } else {
        dispatch(setUserAddress(accounts[0]));
      }
    });
  }, [web3jsInstance, dispatch]);

  return children;
};

export default Web3jsComponent;
