// Create a new context
import { initialize } from '@/utils/railgun';
import { RailgunERC20Amount } from '@railgun-community/shared-models';
import { useContext, createContext, useState, useMemo, useEffect } from 'react';
import {
  BalancesUpdatedCallback,
  setOnBalanceUpdateCallback
} from '@railgun-community/quickstart';

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
  useEffect(() => {
    function walletmoney() {
      const onBalanceUpdateCallback: BalancesUpdatedCallback = ({
        chain,
        railgunWalletID,
        erc20Amounts,
        nftAmounts
      }): void => {
        if (erc20Amounts?.length > 0) setERC20Amounts?.(erc20Amounts?.[0]);
      };

      setOnBalanceUpdateCallback(onBalanceUpdateCallback);
    }
    walletmoney();
  }, []);
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
