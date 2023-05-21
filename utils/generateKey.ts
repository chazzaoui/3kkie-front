import { BytesLike, ethers } from 'ethers';

export const generateEncryptionKey = (
  walletAddress: `0x${string}` | undefined
) => {
  const hashAlgorithm = ethers.utils.sha256; // Choose a suitable hash algorithm
  return hashAlgorithm(walletAddress as BytesLike);
};
