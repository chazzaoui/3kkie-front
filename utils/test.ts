// Initialize the Relayer Client
// await RailgunWakuRelayerClient.start(...)

// In more detail:

// All the imports done from shared-models
import {
  Chain,
  ChainType,
  poll,
  RelayerConnectionStatus,
  SelectedRelayer
} from '@railgun-community/shared-models';
import { RailgunWakuRelayerClient } from '@railgun-community/waku-relayer-client';

// RelayerOptions is needed to call the start function
export type RelayerOptions = {
  pubSubTopic: string;
  wakuDirectPeers: string[];
  peerDiscoveryTimeout?: number;
};

export type RelayerConnectionStatusCallback = (
  chain: Chain,
  status: RelayerConnectionStatus
) => void;

export type RelayerDebugger = {
  log: (msg: string) => void;
  error: (error: Error) => void;
};

// Example of a Chain
export const MOCK_CHAIN_POLYGON: Chain = {
  type: ChainType.EVM,
  id: 127
};

// Define chain for the start function
const chain = MOCK_CHAIN_POLYGON;

// needed for relayerOptions
const pubSubTopic = '/waku/2/default-waku/proto';

const wakuDirectPeers: string[] = [
  '/dns4/relayer.crabdance.com/tcp/8000/wss/p2p/16Uiu2HAm9TiCU9ZRPoKMUyo6QQvZTSceSH5ZtX6u353NHgVCtr1W',
  '/dns4/relayer.chickenkiller.com/tcp/8000/wss/p2p/16Uiu2HAmNy49QzXVWHMdhz7DQHXCpk9sHvVua99j3QcShUK8PVSD'
];

const relayerOptions: RelayerOptions = {
  pubSubTopic,
  wakuDirectPeers
};

let currentChain: Chain;
let currentStatus: RelayerConnectionStatus;

// needed for start function
const statusCallback = (chain: Chain, status: RelayerConnectionStatus) => {
  currentChain = chain;
  currentStatus = status;
};

// Initializes the relayer client
RailgunWakuRelayerClient.start(chain, relayerOptions, statusCallback);

// Wait for Relayers to connect (5-10 sec) and client to collect fees.
// Relayers broadcast fees through the privacy-safe Waku network.

const userRelayAdapt = true;

// Get relayer with lowest fee for a given ERC20 token.
// The address is the address of the WMATIC
const selectedRelayer = RailgunWakuRelayerClient.findBestRelayer(
  chain,
  '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  userRelayAdapt
);

// Create Relayed transaction and send through selected Relayer.

// This below might not be needed for Unshileding so far

// const relayerTransaction = await RelayerTransaction.create(...)
// await RelayerTransaction.send(...)
