import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Pay3kkie: React.FC = () => {
  const router = useRouter();
  const { receiver, amount, token } = router.query;
  return (
    <>
      <div>{receiver}</div>
      <div>
        {amount} {token}
      </div>
    </>
  );
};

export default Pay3kkie;
