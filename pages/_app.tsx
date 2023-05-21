import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { arbitrum, goerli, mainnet, optimism, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react';
import { provider, webSocketProvider } from '@/utils/networks';
import { TokenListProvider } from '@/contexts/TokenContext';
import { useEffect, useMemo } from 'react';
import { initialize } from '@/utils/railgun';
import { useRailgunProvider } from '@/hooks/useRailgunProvider';
import { MoneyInWalletProvider } from '@/contexts/moneyInWallet';
import Head from 'next/head';

const { chains } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : [])
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
});

function MyApp({ Component, pageProps }: AppProps) {
  const { isProviderLoaded, shieldingFees } = useRailgunProvider();
  useMemo(initialize, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = './snarkjs.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <ChakraProvider>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            {isProviderLoaded ? (
              <MoneyInWalletProvider>
                <TokenListProvider shieldingFees={shieldingFees}>
                  <Component {...pageProps} />
                </TokenListProvider>
              </MoneyInWalletProvider>
            ) : null}
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
