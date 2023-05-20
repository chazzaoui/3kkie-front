import {
  ArtifactStore,
  BalancesUpdatedCallback,
  loadProvider,
  setLoggers,
  startRailgunEngine
} from '@railgun-community/quickstart';
import { BrowserLevel } from 'browser-level';
import localforage from 'localforage';
import { getNetwork, networks } from './networks';
import { setOnBalanceUpdateCallback } from '@railgun-community/quickstart';
import { Chain, NFTTokenType } from '@railgun-community/shared-models';

export const loadProviders = async () => {
  // Whether to forward debug logs from Fallback Provider.
  const shouldDebug = true;
  return Promise.all(
    Object.keys(networks).map(async chainIdString => {
      const chainId = Number(chainIdString);
      const { railgunNetworkName, fallbackProviders } = getNetwork(chainId);
      return {
        chainId,
        providerInfo: await loadProvider(
          fallbackProviders,
          railgunNetworkName,
          shouldDebug
        )
      };
    })
  );
};

// LevelDOWN compatible database for storing encrypted wallets.
const db = new BrowserLevel('');

const setLogging = () => {
  const logMessage = console.log;
  const logError = console.error;

  setLoggers(logMessage, logError);
};

const artifactStore = new ArtifactStore(
  async (path: string) => {
    return localforage.getItem(path);
  },
  async (dir: string, path: string, item: string | Buffer) => {
    await localforage.setItem(path, item);
  },
  async (path: string) => (await localforage.getItem(path)) != null
);

export const initialize = () => {
  // Name for your wallet implementation.
  // Encrypted and viewable in private transaction history.
  // Maximum of 16 characters, lowercase.
  const walletSource = 'hi';

  // Persistent store for downloading large artifact files.
  // See Quickstart Developer Guide for platform implementations.

  // Whether to download native C++ or web-assembly artifacts.
  // True for mobile. False for nodejs and browser.
  const useNativeArtifacts = false;

  // Whether to forward Engine debug logs to Logger.
  const shouldDebug = true;

  const skipMerkleTreeScans = false;

  startRailgunEngine(
    walletSource,
    // @ts-ignore
    db,
    shouldDebug,
    artifactStore,
    useNativeArtifacts,
    skipMerkleTreeScans
  );
  setLogging();

  const onBalanceUpdateCallback: BalancesUpdatedCallback = ({
    chain,
    railgunWalletID,
    erc20Amounts,
    nftAmounts
  }): void => {
    console.log(erc20Amounts);
    console.log(nftAmounts);
  };

  setOnBalanceUpdateCallback(onBalanceUpdateCallback);
};
