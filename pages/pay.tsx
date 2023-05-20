import React, { useState } from 'react';
import { RWebShare } from 'react-web-share';
import { useAccount } from 'wagmi';
import QRCode from 'react-qr-code';
import { useRouter } from 'next/router';

const Pay3kkie: React.FC = () => {
  const router = useRouter();
  const { receiver, amount } = router.query;
  return (
    <>
      <div>{receiver}</div>
      <div>{amount}</div>
    </>
  );
};

export default Pay3kkie;
