// Create a new context
import { RailgunERC20Amount } from '@railgun-community/shared-models';
import { useContext, createContext, useState } from 'react';

interface MyMoneysContextType {
  erc20Amounts?: RailgunERC20Amount;
  setERC20Amounts?: React.Dispatch<
    React.SetStateAction<RailgunERC20Amount | undefined>
  >;
  paymentSuccess: boolean;
  setPaymentSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MoneyInWallet = createContext<MyMoneysContextType>({
  erc20Amounts: { tokenAddress: '', amountString: '' },
  setERC20Amounts: () => {},
  paymentSuccess: false,
  setPaymentSuccess: () => {}
});

// Create a provider component
export const MoneyInWalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [erc20Amounts, setERC20Amounts] = useState<
    RailgunERC20Amount | undefined
  >();
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  return (
    <MoneyInWallet.Provider
      value={{
        erc20Amounts,
        setERC20Amounts,
        paymentSuccess,
        setPaymentSuccess
      }}
    >
      {children}
    </MoneyInWallet.Provider>
  );
};
