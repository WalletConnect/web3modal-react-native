import { proxy } from 'valtio';

// -- Types --------------------------------------------- //
export interface AssetControllerState {
  walletImages: Record<string, string>;
  networkImages: Record<string, string>;
  connectorImages: Record<string, string>;
  tokenImages: Record<string, string>;
}

// -- State --------------------------------------------- //
const state = proxy<AssetControllerState>({
  walletImages: {},
  networkImages: {},
  connectorImages: {},
  tokenImages: {}
});

// -- Controller ---------------------------------------- //
export const AssetController = {
  state,

  setWalletImage(key: string, value: string) {
    state.walletImages[key] = value;
  },

  setNetworkImage(key: string, value: string) {
    state.networkImages[key] = value;
  },

  setConnectorImage(key: string, value: string) {
    state.connectorImages[key] = value;
  },

  setTokenImage(key: string, value: string) {
    state.tokenImages[key] = value;
  }
};
