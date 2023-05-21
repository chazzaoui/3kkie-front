// import {
//   gasEstimateForUnprovenUnshield,
//   generateUnshieldProof,
//   populateProvedUnshield
// } from '@railgun-community/quickstart';
// import {
//   EVMGasType,
//   FeeTokenDetails,
//   NetworkName,
//   RailgunERC20AmountRecipient,
//   TransactionGasDetailsSerialized,
//   deserializeTransaction
// } from '@railgun-community/shared-models';
// import { BigNumber } from 'ethers';
// import { useAccount } from 'wagmi';
// import { generateEncryptionKey } from './generateKey';

// export const handleUnshield = async (
//   unshieldAdress: string,
//   amount: string,
//   tokenAddress: string,
//   address: `0x${string}`
// ) => {
//   const erc20AmountRecipients: RailgunERC20AmountRecipient[] = [
//     {
//       tokenAddress: tokenAddress, // DAI
//       amountString: amount, // hexadecimal amount
//       recipientAddress: unshieldAdress as string
//     }
//   ];
//   const railgunWalletID = localStorage.getItem('railgunId') as string;

//   // Public wallet to unshield to.
//   const publicWalletAddress = address;

//   // Database encryption key. Keep this very safe.
//   const encryptionKey = generateEncryptionKey(address);

//   // Gas price, used to calculate Relayer Fee iteratively.
//   const originalGasDetailsSerialized: TransactionGasDetailsSerialized = {
//     evmGasType: EVMGasType.Type2, // Depends on the chain (BNB uses type 0)
//     gasEstimateString: '0x00', // Always 0, we don't have this yet.
//     maxFeePerGasString: '0x100000', // Current gas Max Fee
//     maxPriorityFeePerGasString: '0x010000' // Current gas Max Priority Fee
//   };

//   // Whether to use a Relayer or self-signing wallet.
//   // true for self-signing, false for Relayer.
//   const sendWithPublicWallet = true;

//   const { gasEstimateString, error } = await gasEstimateForUnprovenUnshield(
//     NetworkName.Ethereum,
//     railgunWalletID,
//     encryptionKey,
//     erc20AmountRecipients,
//     [], // nftAmountRecipients
//     originalGasDetailsSerialized,
//     undefined,
//     sendWithPublicWallet
//   );
//   if (error) {
//     // Handle gas estimate error.
//   }

//   const gasEstimate = BigNumber.from(gasEstimateString || '0x00');

//   // See above for examples of other required fields.

//   // Token fee to pay Relayer.

//   // Minimum gas price, only required for relayed transaction.
//   const overallBatchMinGasPrice: string = '0x10000';

//   const progressCallback = (progress: number) => {
//     // Handle proof progress (show in UI).
//     // Proofs can take 20-30 seconds on slower devices.
//   };

//   const { error: unshieldErr } = await generateUnshieldProof(
//     NetworkName.Ethereum,
//     railgunWalletID,
//     encryptionKey,
//     erc20AmountRecipients,
//     [], // nftAmountRecipients
//     undefined,
//     sendWithPublicWallet,
//     overallBatchMinGasPrice,
//     progressCallback
//   );
//   if (error) {
//     console.log({ unshieldErr });
//   }

//   // NOTE: Must follow proof generation.
//   // Use the exact same parameters as proof or this will throw invalid error.

//   // Gas to use for the transaction.
//   const gasDetailsSerialized: TransactionGasDetailsSerialized = {
//     evmGasType: EVMGasType.Type2, // Depends on the chain (BNB uses type 0)
//     gasEstimateString: '0x0100', // Output from gasEstimateForDeposit
//     maxFeePerGasString: '0x100000', // Current gas Max Fee
//     maxPriorityFeePerGasString: '0x010000' // Current gas Max Priority Fee
//   };

//   const { serializedTransaction, error: popError } =
//     await populateProvedUnshield(
//       railgunWalletID,
//       erc20AmountRecipients,
//       [], // nftAmountRecipients
//       relayerFeeERC20AmountRecipient,
//       sendWithPublicWallet,
//       gasDetailsSerialized,
//       overallBatchMinGasPrice
//     );
//   if (popError) {
//     console.log({ popError });
//   }

//   const transaction = deserializeTransaction(serializedTransaction);
//   console.log({ transaction });
//   // Send serializedTransaction to Relayer.
// };
