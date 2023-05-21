import { useState, useEffect, useMemo, useContext } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CopyIcon } from '@chakra-ui/icons';
import { RWebShare } from 'react-web-share';
import { useAccount } from 'wagmi';
import QRCode from 'react-qr-code';
import { entropyToMnemonic, randomBytes } from 'ethers/lib/utils';
import {
  createRailgunWallet,
  loadWalletByID,
  balanceForERC20Token
} from '@railgun-community/quickstart';

const mnemonic = entropyToMnemonic(randomBytes(16));
import {
  Container,
  Flex,
  Center,
  Heading,
  Box,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Text,
  IconButton,
  useClipboard,
  useToast
} from '@chakra-ui/react';
import { generateEncryptionKey } from '@/utils/generateKey';
import { NetworkName } from '@railgun-community/shared-models';
import TokenInput from '@/components/TokenInput';
import { TokenListContextItem, useToken } from '@/contexts/TokenContext';
import { ethers } from 'ethers';
import { MoneyInWallet } from '@/contexts/moneyInWallet';

const Home: React.FC = () => {
  const { erc20Amounts } = useContext(MoneyInWallet);
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const { tokenList } = useToken();

  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenListContextItem>(
    tokenList[0]
  );
  const [url, setUrl] = useState('');

  const [railgunWallet, setRailgunWallet] = useState<string | undefined>('');
  const toast = useToast();
  const railgunId = localStorage.getItem('railgunId');
  const { hasCopied, onCopy } = useClipboard(url);

  useEffect(() => {
    const loadRailgunWallet = async () => {
      const encryptionKey = generateEncryptionKey(address);

      if (railgunId) {
        const railgunWallet = await loadWalletByID(
          encryptionKey,
          railgunId,
          false
        );
        setRailgunWallet(railgunWallet.railgunWalletInfo?.railgunAddress);
      }
    };

    loadRailgunWallet();
  }, []);

  const handleWalletCreation = async () => {
    const encryptionKey = generateEncryptionKey(address);

    const creationBlockNumberMap = {
      [NetworkName.Ethereum]: 15725700,
      [NetworkName.Polygon]: 3421400
    };
    if (!railgunId) {
      const railgunWallet = await createRailgunWallet(
        encryptionKey,
        mnemonic,
        creationBlockNumberMap
      );
      localStorage.setItem('railgunId', railgunId as string);
      setRailgunWallet(railgunWallet.railgunWalletInfo?.railgunAddress);
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleRequest = () => {
    setUrl(
      `http://localhost:3000/pay?receiver=${railgunWallet}&amount=${amount}&token=${selectedToken?.symbol}`
    );
    handleWalletCreation();
    setShowQRCode(!showQRCode);
  };

  const handleCopy = () => {
    onCopy();
    toast({
      title: 'URL Copied',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };

  if (showQRCode) {
    return (
      <Container style={{ height: '100%' }}>
        <Flex as='header' position='fixed' backgroundColor='white' w='100%'>
          <ConnectButton />
        </Flex>
        <Center
          paddingTop={20}
          style={{ height: '100%', flexDirection: 'column' }}
        >
          <Heading as='h3' mb={4} size='xl' noOfLines={1}>
            Share this link or show QR code
          </Heading>
          <Text fontSize='lg' mb={8}>
            We recommend sending it using VPN and from a burner phone number or
            anonymous account
          </Text>
          <Box p={4} style={{ width: '80%' }}>
            <Flex direction='column' alignItems='center' mb={8}>
              <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '100%' }}
                value={url}
                viewBox={`0 0 256 256`}
              />
            </Flex>
            <Flex alignItems='center' mb={4}>
              <Text
                overflow='hidden'
                textOverflow='ellipsis'
                whiteSpace='nowrap'
              >
                {url}
              </Text>
              <IconButton
                aria-label='Copy URL'
                variant='ghost'
                colorScheme='gray'
                icon={<CopyIcon />}
                onClick={handleCopy}
                ml={2}
              />
            </Flex>
            <Center flexDirection={'column'}>
              <RWebShare
                data={{
                  text: 'You got a 3ikkie!',
                  url: url,
                  title: 'Payment request'
                }}
                onClick={() => console.log('shared successfully!')}
              >
                <Button
                  style={{
                    width: '100%',
                    background: 'black',
                    color: 'white',
                    fontSize: '24px',
                    height: '64px',
                    marginBottom: 8
                  }}
                >
                  Share on Social
                </Button>
              </RWebShare>
              <Button
                style={{
                  width: '100%',
                  color: 'black',
                  fontSize: '24px',
                  height: '64px',
                  border: '1px solid black'
                }}
                mb={4}
                onClick={handleRequest}
              >
                Create New Request
              </Button>
            </Center>
          </Box>
        </Center>
      </Container>
    );
  }

  return (
    <Container style={{ height: '100vh' }}>
      <Flex as='header' position='fixed' backgroundColor='white' w='100%'>
        <ConnectButton />
      </Flex>
      <Center
        paddingTop={20}
        style={{ height: '100%', flexDirection: 'column' }}
      >
        <Heading as='h3' mb={16} size='xl' noOfLines={1}>
          {`Your wallet money is: ${ethers.utils.formatUnits(
            erc20Amounts?.amountString || '0',
            18
          )}`}
        </Heading>
        <Heading as='h3' mb={16} size='xl' noOfLines={1}>
          Private transfer
        </Heading>
        <Box
          style={{
            padding: '24px',
            border: '1px solid black'
          }}
        >
          <TokenInput
            value={selectedToken}
            onSelect={token => {
              setSelectedToken(token);
            }}
            onBlur={async function (event: {
              target: any;
              type?: any;
            }): Promise<boolean | void> {}}
            onChange={async function (event: {
              target: any;
              type?: any;
            }): Promise<boolean | void> {}}
            name={''}
          />
          <NumberInput mb={12}>
            <NumberInputField
              placeholder='0.00'
              value={amount}
              onChange={handleAmountChange}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Center>
            <Button
              style={{
                width: '100%',
                background: 'black',
                color: 'white',
                fontSize: '24px',
                height: '64px'
              }}
              alignSelf={'center'}
              onClick={handleRequest}
            >
              Request
            </Button>
          </Center>
        </Box>
      </Center>
    </Container>
  );
};

export default Home;
