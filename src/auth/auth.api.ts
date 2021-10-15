export const generateNonce = async (action, tokenId) => {
  const response = await fetch(`${process.env.REACT_APP_PUBLIC_SKILL_WALLET_API_URL}/api/skillWallet/${tokenId}/nonces?action=${action}`, {
    method: 'POST',
  });
  const nonce = await response.json();
  return nonce.nonce;
};
