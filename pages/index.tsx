import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CopyIcon } from '@chakra-ui/icons';
import { RWebShare } from 'react-web-share';
import { useAccount } from 'wagmi';
import QRCode from 'react-qr-code';
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

const Home: React.FC = () => {
  const { address } = useAccount();
  const [selectedToken, setSelectedToken] = useState('');
  const [amount, setAmount] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const url = `http://localhost:3000/pay?receiver=${address}&amount=${amount}&token=${selectedToken}`;
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(url);

  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleRequest = () => {
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

  if (!showQRCode) {
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
                flex='1'
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
          Private transfer
        </Heading>
        <Box
          style={{
            padding: '24px',
            border: '1px solid black'
          }}
        >
          <Select
            aria-label='Amount'
            mt={4}
            mb={4}
            placeholder='Select token'
            value={selectedToken}
            onChange={handleTokenChange}
          >
            <option value='ETH'>ETH</option>
            <option value='MATIC'>MATIC</option>
            <option value='BTC'>BTC</option>
          </Select>
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
