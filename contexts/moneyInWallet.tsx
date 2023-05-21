// Create a new context
import { useContext, createContext, useState } from 'react';

interface MyMoneysContextType {
  erc20Amounts?: string;
  setERC20Amounts?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const MoneyInWallet = createContext<MyMoneysContextType>({
  erc20Amounts: '0',
  setERC20Amounts: () => {}
});

// Create a provider component
export const MoneyInWalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [erc20Amounts, setERC20Amounts] = useState<string | undefined>('');
  console.log(erc20Amounts, 'byeeeeeeeeeeeeeeeeeeee');
  return (
    <MoneyInWallet.Provider value={{ erc20Amounts, setERC20Amounts }}>
      {children}
    </MoneyInWallet.Provider>
  );
};
