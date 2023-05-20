import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { RWebShare } from 'react-web-share';
import { useAccount } from 'wagmi';
import QRCode from 'react-qr-code';
import {
  Center,
  Flex,
  Container,
  Heading,
  Box,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select
} from '@chakra-ui/react';

const Home: React.FC = () => {
  const { address } = useAccount();
  const [selectedToken, setSelectedToken] = useState('');
  const [amount, setAmount] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleRequest = () => {
    setShowQRCode(true);
  };

  if (showQRCode) {
    const url = `http://localhost:3000/pay?receiver=${address}&amount=${amount}&token=${selectedToken}`;

    return (
      <div>
        <QRCode
          size={256}
          style={{ height: 'auto', maxWidth: '50%', width: '50%' }}
          value={url}
          viewBox={`0 0 256 256`}
        />
        <RWebShare
          data={{
            text: 'You got a 3ikkie!',
            url: url,
            title: 'Payment request'
          }}
          onClick={() => console.log('shared successfully!')}
        >
          <button>Share 🔗</button>
        </RWebShare>
      </div>
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
                fontSize: 'px',
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
