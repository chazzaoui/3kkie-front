import { 
    startRailgunEngine, 
} from '@railgun-community/quickstart';

import { 
  StartRailgunEngineResponse, 
} from '@railgun-community/shared-models';
import { ArtifactStore } from '@railgun-community/quickstart';
import localforage from 'localforage';

import { getProver, Groth16 } from '@railgun-community/quickstart';

// import { groth16 } from 'snarkjs';

const snarkjs = require("snarkjs");


const artifactStore = new ArtifactStore(
    async (path: string) => {
      return localforage.getItem(path);
    },
    async (dir: string, path: string, item: string | Buffer) => {
      await localforage.setItem(path, item);
    },
    async (path: string) => (await localforage.getItem(path)) != null,
);

const levelup = require('levelup')
const leveljs = require('level-js')
  
export const initialize = (): StartRailgunEngineResponse => {
    // Name for your wallet implementation.
    // Encrypted and viewable in private transaction history.
    // Maximum of 16 characters, lowercase.
    const walletSource = 'quickstart demo';
    
    // LevelDOWN compatible database for storing encrypted wallets.
    // const db = new LevelDB('./db');
    const db = levelup(leveljs('bigdata'))

    // Whether to forward Engine debug logs to Logger.
    const shouldDebug = true;
    
    // Persistent store for downloading large artifact files.
    // See Quickstart Developer Guide for platform implementations.
    // const artifactStore = new ArtifactStore();
    
    // Whether to download native C++ or web-assembly artifacts.
    // True for mobile. False for nodejs and browser.
    const useNativeArtifacts = false;
    
    // Whether to skip merkletree syncs and private balance scans. 
    // Only set to TRUE in shield-only applications that don't 
    //  load private wallets or balances.
    const skipMerkletreeScans = false;
    
    return startRailgunEngine(
      walletSource,
      db,
      shouldDebug,
      artifactStore,
      useNativeArtifacts,
      skipMerkletreeScans,
    )
  }

  function initRailgun() {
    initialize();
    getProver().setSnarkJSGroth16(snarkjs.groth16 as Groth16);
  }

  export default initRailgun;