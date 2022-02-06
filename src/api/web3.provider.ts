import { ContractInterface, ethers } from 'ethers';

let provider = new ethers.providers.Web3Provider(window.ethereum);

export const Web3ContractProvider = async (addressOrName: string, contractInterface: ContractInterface) => {
  if (!window.ethereum.selectedAddress) {
    await window.ethereum.enable();
  }

  if (!provider) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  }
  const signer = provider.getSigner();
  return new ethers.Contract(addressOrName, contractInterface, signer);
};
