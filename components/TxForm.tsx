import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { Input, InputGroup } from '@chakra-ui/input';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { useDisclosure } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/textarea';
import { getRailgunSmartWalletContractForNetwork } from '@railgun-community/quickstart';
import { validateRailgunAddress } from '@railgun-community/quickstart';
import { erc20ABI } from '@wagmi/core';
import { GetNetworkResult, watchNetwork } from '@wagmi/core';
import { BigNumber, ethers } from 'ethers';
import { useSWRConfig } from 'swr';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite
} from 'wagmi';
import ReviewTransactionModal from '@/components/ReviewTransactionModal';
import TokenInput from '@/components/TokenInput';
import { useToken } from '@/contexts/TokenContext';
import { TokenListContextItem } from '@/contexts/TokenContext';
import useNotifications from '@/hooks/useNotifications';
import useResolveUnstoppableDomainAddress from '@/hooks/useResolveUnstoppableDomainAddress';
import useTokenAllowance from '@/hooks/useTokenAllowance';
import {
  UNSTOPPABLE_DOMAIN_SUFFIXES,
  VALID_AMOUNT_REGEX,
  ethAddress
} from '@/utils/constants';
import { buildBaseToken, getNetwork } from '@/utils/networks';
import { endsWithAny } from '@/utils/string';
import { isAmountParsable } from '@/utils/token';
import { useRouter } from 'next/router';
import { MoneyInWallet } from '@/contexts/moneyInWallet';
import { motion } from 'framer-motion';

type TxFormValues = {
  recipient: string;
  amount: string;
  token: string;
};

export const TxForm = ({
  recipientAddress,
  amount,
  token
}: {
  recipientAddress?: string;
  amount?: string;
  token?: string;
}) => {
  const { tokenAllowances, tokenList } = useToken();
  const { mutate } = useSWRConfig();
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const network = getNetwork(chain?.id);
  const { notifyUser, txNotify } = useNotifications();
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors }
  } = useForm<TxFormValues>({
    mode: 'onChange',
    defaultValues: {
      recipient: recipientAddress,
      amount: amount
    }
  });
  const {
    isOpen: isReviewOpen,
    onOpen: openReview,
    onClose: closeReview
  } = useDisclosure();

  const [selectedToken, setSelectedToken] = useState<TokenListContextItem>(
    tokenList[0]
  );
  const { paymentSuccess } = useContext(MoneyInWallet);

  const [validAddress, setValidAddress] = useState(false);
  // const { config } = usePrepareContractWrite({
  //   address: selectedToken?.address as `0x${string}`,
  //   abi: erc20ABI,
  //   functionName: 'approve',
  //   args: [
  //     getRailgunSmartWalletContractForNetwork(network.railgunNetworkName)
  //       .address as `0x{string}`,
  //     ethers.utils.parseUnits(tokenAmount || '0', selectedToken?.decimals)
  //   ]
  // });
  // const { writeAsync: doErc20Approval } = useContractWrite(config);
  useEffect(() => {
    const tokenWithChainId = tokenList.find(
      toke => toke.symbol === token
    ) as TokenListContextItem;
    setSelectedToken(tokenWithChainId);
  }, [token]);

  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data } = useTokenAllowance({ address: selectedToken?.address || '' });
  const tokenAllowance =
    tokenAllowances.get(selectedToken?.address || '') ||
    data ||
    BigNumber.from(0);
  const [recipient, setRecipient] = useState<string>(recipientAddress || '');
  const [recipientDisplayName, setRecipientDisplayName] = useState<string>(
    recipientAddress || ''
  );
  const { data: resolvedUnstoppableDomain, trigger: resolveDomain } =
    useResolveUnstoppableDomainAddress();
  console.log(
    selectedToken?.address,
    ethAddress,
    ethers.utils
      .parseUnits(amount || '0', selectedToken?.decimals)
      .gt(tokenAllowance)
  );
  console.log({ selectedToken });
  const needsApproval =
    selectedToken?.address !== ethAddress &&
    ethers.utils
      .parseUnits(amount || '0', selectedToken?.decimals)
      .gt(tokenAllowance);

  const onCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.host}/send?address=${recipientDisplayName}`
    );
    notifyUser({
      alertType: 'success',
      message: 'Shield link copied to clipboard'
    });
  };
  const onSubmit = handleSubmit(async values => {
    setRecipient(resolvedUnstoppableDomain || values.recipient);
    setRecipientDisplayName(values.recipient);
    openReview();
  });

  const updateOnNetworkChange = useCallback(
    (net: GetNetworkResult) => {
      if (net && net?.chain) {
        const chain = getNetwork(net?.chain.id);
        const token = buildBaseToken(chain.baseToken, net.chain.id);
        setSelectedToken(token);
        setValue('token', chain.baseToken.name);
      }
    },
    [setValue]
  );

  useEffect(() => {
    const unwatch = watchNetwork(updateOnNetworkChange);
    return unwatch;
  }, [updateOnNetworkChange]);

  if (paymentSuccess)
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100vh'
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Heading as='h3' mb={8} size='xl' noOfLines={1}>
            Payment successful!
          </Heading>
          <img
            src={'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif'}
          />
        </motion.div>
      </Box>
    );

  return (
    <Box maxWidth='24rem' className='container'>
      <form onSubmit={onSubmit}>
        <FormControl isInvalid={Boolean(errors.recipient?.message)}>
          <Flex justify='space-between'>
            <FormLabel>Recipient address</FormLabel>

            {validAddress && (
              <Text
                cursor='pointer'
                textDecoration='underline'
                fontSize='xs'
                textAlign='center'
                onClick={onCopy}
              >
                Copy Shield Link
                <CopyIcon ml='.25rem' />
              </Text>
            )}
          </Flex>
          <Textarea
            variant='outline'
            size='lg'
            resize='none'
            mb='.25rem'
            height='9rem'
            disabled
            placeholder='0zk1qyn0qa5rgk7z2l8wyncpynmydgj7ucrrcczhl8k27q2rw5ldvv2qrrv7j6fe3z53ll5j4fjs9j5cmq7mxsaulah7ykk6jwqna3nwvxudp5w6fwyg8cgwkwwv3g4'
            {...register('recipient', {
              required: 'This is required',
              onChange: e => {
                setRecipientDisplayName(e.target.value);
              },
              validate: async value => {
                const validRailgunAddress = validateRailgunAddress(value);

                if (validRailgunAddress) {
                  setValidAddress(true);
                  return true;
                }

                if (endsWithAny(value, UNSTOPPABLE_DOMAIN_SUFFIXES)) {
                  const resolvedUnstoppableDomain = await resolveDomain({
                    name: value
                  });

                  if (resolvedUnstoppableDomain) {
                    setValidAddress(true);
                    return true;
                  }
                }
                setValidAddress(false);
                return 'Invalid railgun address or unstoppable domain does not resolve to a railgun address';
              }
            })}
          />
          <FormErrorMessage my='.25rem'>
            {errors.recipient && errors.recipient.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={Boolean(errors.token?.message)} mt='.5rem'>
          <FormLabel>Token</FormLabel>
          <Input
            variant='outline'
            size='lg'
            pr='4.5rem'
            height='100%'
            padding={4}
            placeholder={token}
            disabled={true}
            value={token}
          />
        </FormControl>
        <FormControl isInvalid={Boolean(errors.amount?.message)}>
          <FormLabel>Amount</FormLabel>
          <InputGroup size='lg' width='auto' height='4rem'>
            <Input
              variant='outline'
              size='lg'
              pr='4.5rem'
              height='100%'
              placeholder='0.1'
              disabled={true}
              value={amount}
              // {...register('amount', {
              //   required: 'This is required',
              //   validate: value => {
              //     try {
              //       if (
              //         !VALID_AMOUNT_REGEX.test(value) &&
              //         isNaN(parseFloat(value))
              //       ) {
              //         return 'Not a valid number';
              //       }

              //       return (
              //         Boolean(
              //           ethers.utils
              //             .parseUnits(value || '0', selectedToken?.decimals)
              //             .gt(BigNumber.from('0'))
              //         ) || 'Amount must be greater than 0'
              //       );
              //     } catch (e) {
              //       return 'Not a valid number';
              //     }
              //   }
              // })}
            />
          </InputGroup>
          <FormErrorMessage my='.25rem'>
            {errors.amount && errors.amount.message}
          </FormErrorMessage>
        </FormControl>
        {needsApproval ? (
          <Button
            size='lg'
            mt='.75rem'
            width='100%'
            isDisabled={!isConnected || chain?.unsupported || isApprovalLoading}
            onClick={async () => {
              // if (!doErc20Approval) {
              //   notifyUser({
              //     alertType: 'error',
              //     message:
              //       'Page is not prepared for ERC20 approval. Please try again in a few seconds'
              //   });
              //   return;
              // }
              // setIsApprovalLoading(true);
              // const tx = await doErc20Approval().catch(err =>
              //   console.error(err)
              // );
              // if (tx) {
              //   await txNotify(tx.hash);
              //   mutate(
              //     key =>
              //       typeof key === 'string' &&
              //       key.startsWith('useTokenAllowance')
              //   );
              // } else {
              //   notifyUser({
              //     alertType: 'error',
              //     message: 'Failed to approve token'
              //   });
              // }
              setIsApprovalLoading(false);
            }}
          >
            Approve
          </Button>
        ) : (
          <Button
            isDisabled={!isConnected || chain?.unsupported}
            type='submit'
            size='lg'
            mt='.75rem'
            width='100%'
          >
            Shield
          </Button>
        )}
        {selectedToken && (
          <ReviewTransactionModal
            isOpen={isReviewOpen}
            onClose={closeReview}
            recipient={recipient}
            displayName={recipientDisplayName}
            token={selectedToken}
            amount={amount}
            onSubmitClick={() => {
              reset(values => ({
                ...values,
                recipient: values.recipient,
                amount: ''
              }));
            }}
          />
        )}
      </form>
    </Box>
  );
};
