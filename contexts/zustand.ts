import { create } from 'zustand';

export const useWalletStore = create(set => ({
  walletAmount: 0,
  setWalletAmount: (amount: string) => set(() => ({ walletAmount: amount }))
}));
