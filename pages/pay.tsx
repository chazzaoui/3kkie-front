import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Flex, Center, Box } from '@chakra-ui/react';
import { TxForm } from '../components/TxForm';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Pay3kkie: React.FC = () => {
  const router = useRouter();
  const { receiver, amount, token } = router.query;
  return (
    <Container style={{ height: '100%' }}>
      <Flex as='header' position='fixed' backgroundColor='white' w='100%'>
        <ConnectButton />
      </Flex>
      <Box paddingTop={20}>
        <TxForm
          token={token as string}
          amount={amount as string}
          recipientAddress={receiver as string}
        />
      </Box>
    </Container>
  );
};

export default Pay3kkie;
