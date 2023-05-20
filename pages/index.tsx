import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
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
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
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
          <Select aria-label='Amount' mt={4} mb={4} placeholder='Select token'>
            <option value='option1'>ETH</option>
            <option value='option2'>MATIC</option>
            <option value='option3'>BTC</option>
          </Select>
          <NumberInput mb={12}>
            <NumberInputField placeholder='0.00' />
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
