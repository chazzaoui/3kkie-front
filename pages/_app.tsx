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
import { useMemo } from 'react';
import { initialize } from '@/utils/railgun';
import { useRailgunProvider } from '@/hooks/useRailgunProvider';

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
  useMemo(initialize, []);
  const { isProviderLoaded, shieldingFees } = useRailgunProvider();
  return (
    <ChakraProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          {isProviderLoaded ? (
            <TokenListProvider shieldingFees={shieldingFees}>
              <Component {...pageProps} />
            </TokenListProvider>
          ) : null}
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
