import { proxy, ref } from 'valtio';
import { CoreHelperUtil } from '../utils/CoreHelperUtil';
import { StorageUtil } from '../utils/StorageUtil';
import type { WcWallet } from '../utils/TypeUtils';

// -- Types --------------------------------------------- //
export interface ConnectionControllerClient {
  connectWalletConnect: (onUri: (uri: string) => void) => Promise<void>;
  disconnect: () => Promise<void>;
  connectExternal?: (id: string) => Promise<void>;
  connectInjected?: () => Promise<void>;
  checkInjectedInstalled?: (ids?: string[]) => boolean;
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
  recentWallet?: WcWallet;
}

// -- State --------------------------------------------- //
const state = proxy<ConnectionControllerState>({
  wcError: false
});

// -- Controller ---------------------------------------- //
export const ConnectionController = {
  state,

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
    });
  },

  async connectExternal(id: string) {
    await this._getClient().connectExternal?.(id);
  },

  async connectInjected() {
    await this._getClient().connectInjected?.();
  },

  checkInjectedInstalled(ids?: string[]) {
    return this._getClient().checkInjectedInstalled?.(ids);
  },

  resetWcConnection() {
    state.wcUri = undefined;
    state.wcPairingExpiry = undefined;
    state.wcPromise = undefined;
    state.wcLinking = undefined;
    state.recentWallet = undefined;
    StorageUtil.deleteWalletConnectDeepLink();
  },

  setWcLinking(wcLinking: ConnectionControllerState['wcLinking']) {
    state.wcLinking = wcLinking;
  },

  setWcError(wcError: ConnectionControllerState['wcError']) {
    state.wcError = wcError;
  },

  setRecentWallet(wallet: ConnectionControllerState['recentWallet']) {
    state.recentWallet = wallet;
  },

  async disconnect() {
    await this._getClient().disconnect();
    this.resetWcConnection();
  }
};
