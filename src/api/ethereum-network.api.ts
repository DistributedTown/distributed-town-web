const timeout = (prom: Promise<any>, time: number) => Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time))]);

export const connectToEthereum = async (): Promise<boolean> => {
  if (!window.ethereum.selectedAddress) {
    try {
      await timeout(window.ethereum.request({ method: 'eth_requestAccounts' }), 20000);
      return true;
    } catch (error) {
      return false;
    }
  }
  return true;
};

export const switchToEtheremNetwork = async (): Promise<boolean> => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13881' }],
    });
  } catch (switchError) {
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
        return false;
      }
    }
  }
  return true;
};
