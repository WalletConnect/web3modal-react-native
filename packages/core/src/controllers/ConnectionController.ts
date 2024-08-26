import { subscribeKey as subKey } from 'valtio/utils';
import { proxy, ref } from 'valtio';
import { CoreHelperUtil } from '../utils/CoreHelperUtil';
import { StorageUtil } from '../utils/StorageUtil';
import type {
  Connector,
  SendTransactionArgs,
  WcWallet,
  WriteContractArgs
} from '../utils/TypeUtil';
import { RouterController } from './RouterController';
import { ConnectorController } from './ConnectorController';
import { TransactionsController } from './TransactionsController';

// -- Types --------------------------------------------- //
export interface ConnectExternalOptions {
  id: Connector['id'];
  type: Connector['type'];
  provider?: Connector['provider'];
  info?: Connector['info'];
}

export interface ConnectionControllerClient {
  connectWalletConnect: (onUri: (uri: string) => void) => Promise<void>;
  connectExternal?: (options: ConnectExternalOptions) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (args: SendTransactionArgs) => Promise<`0x${string}` | null>;
  parseUnits: (value: string, decimals: number) => bigint;
  formatUnits: (value: bigint, decimals: number) => string;
  writeContract: (args: WriteContractArgs) => Promise<`0x${string}` | null>;
  disconnect: () => Promise<void>;
}

export interface ConnectionControllerState {
  _client?: ConnectionControllerClient;
  wcUri?: string;
  wcPromise?: Promise<void>;
  wcPairingExpiry?: number;
  wcLinking?: {
    href: string;
    name: string;
  };
  wcError?: boolean;
  pressedWallet?: WcWallet;
  recentWallets?: WcWallet[];
  connectedWalletImageUrl?: string;
}

type StateKey = keyof ConnectionControllerState;

// -- State --------------------------------------------- //
const state = proxy<ConnectionControllerState>({
  wcError: false
});

// -- Controller ---------------------------------------- //
export const ConnectionController = {
  state,

  subscribeKey<K extends StateKey>(
    key: K,
    callback: (value: ConnectionControllerState[K]) => void
  ) {
    return subKey(state, key, callback);
  },

  _getClient() {
    if (!state._client) {
      throw new Error('ConnectionController client not set');
    }

    return state._client;
  },

  setClient(client: ConnectionControllerClient) {
    state._client = ref(client);
  },

  connectWalletConnect() {
    state.wcPromise = this._getClient().connectWalletConnect(uri => {
      state.wcUri = uri;
      state.wcPairingExpiry = CoreHelperUtil.getPairingExpiry();
      ConnectorController.setConnectedConnector('WALLET_CONNECT');
      StorageUtil.setConnectedConnector('WALLET_CONNECT');
    });
  },

  async connectExternal(options: ConnectExternalOptions) {
    await this._getClient().connectExternal?.(options);
    ConnectorController.setConnectedConnector(options.type);
    StorageUtil.setConnectedConnector(options.type);
  },

  async signMessage(message: string) {
    return this._getClient().signMessage(message);
  },

  setWcLinking(wcLinking: ConnectionControllerState['wcLinking']) {
    state.wcLinking = wcLinking;
  },

  removeWcLinking() {
    state.wcLinking = undefined;
  },

  setWcError(wcError: ConnectionControllerState['wcError']) {
    state.wcError = wcError;
  },

  setPressedWallet(wallet: ConnectionControllerState['pressedWallet']) {
    state.pressedWallet = wallet;
  },

  removePressedWallet() {
    state.pressedWallet = undefined;
  },

  setRecentWallets(wallets: ConnectionControllerState['recentWallets']) {
    state.recentWallets = wallets;
  },

  async setConnectedWalletImageUrl(url: ConnectionControllerState['connectedWalletImageUrl']) {
    state.connectedWalletImageUrl = url;

    if (url) {
      await StorageUtil.setConnectedWalletImageUrl(url);
    } else {
      StorageUtil.removeConnectedWalletImageUrl();
    }
  },

  parseUnits(value: string, decimals: number) {
    return this._getClient().parseUnits(value, decimals);
  },

  formatUnits(value: bigint, decimals: number) {
    return this._getClient().formatUnits(value, decimals);
  },

  async sendTransaction(args: SendTransactionArgs) {
    return this._getClient().sendTransaction(args);
  },

  async writeContract(args: WriteContractArgs) {
    return this._getClient().writeContract(args);
  },

  resetWcConnection() {
    state.wcUri = undefined;
    state.wcPairingExpiry = undefined;
    state.wcPromise = undefined;
    state.wcLinking = undefined;
    state.pressedWallet = undefined;
    state.connectedWalletImageUrl = undefined;
    ConnectorController.setConnectedConnector(undefined);
    TransactionsController.resetTransactions();
    StorageUtil.removeWalletConnectDeepLink();
    StorageUtil.removeConnectedWalletImageUrl();
    StorageUtil.removeConnectedConnector();
  },

  async disconnect() {
    await this._getClient().disconnect();
    this.resetWcConnection();
    RouterController.reset('Connect');
  }
};
