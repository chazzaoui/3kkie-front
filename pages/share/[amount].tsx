import React, { useState } from 'react';
import { RWebShare } from 'react-web-share';
import { useAccount } from 'wagmi';
import QRCode from 'react-qr-code';
import { useRouter } from 'next/router';

const Share3ikkie: React.FC = () => {
  const { address } = useAccount();
  const router = useRouter();
  const { amount } = router.query;
  const url = `http://localhost:3000/pay?receiver=${address}&amount=${amount}`;
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
};

export default Share3ikkie;
