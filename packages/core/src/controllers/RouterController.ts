import { proxy } from 'valtio';
import type { WcWallet, CaipNetwork, Connector } from '../utils/TypeUtil';

// -- Types --------------------------------------------- //
export interface RouterControllerState {
  view:
    | 'Account'
    | 'Connect'
    | 'ConnectingWalletConnect'
    | 'ConnectingExternal'
    | 'Networks'
    | 'SwitchNetwork'
    | 'AllWallets'
    | 'WhatIsAWallet'
    | 'WhatIsANetwork'
    | 'GetWallet'
    | 'EmailVerifyDevice'
    | 'EmailVerifyOtp'
    | 'UpdateEmailWallet'
    | 'UpdateEmailPrimaryOtp'
    | 'UpdateEmailSecondaryOtp'
    | 'UpgradeEmailWallet';
  history: RouterControllerState['view'][];
  data?: {
    connector?: Connector;
    wallet?: WcWallet;
    network?: CaipNetwork;
    email?: string;
    newEmail?: string;
  };
}

// -- State --------------------------------------------- //
const state = proxy<RouterControllerState>({
  view: 'Connect',
  history: ['Connect']
});

// -- Controller ---------------------------------------- //
export const RouterController = {
  state,

  push(view: RouterControllerState['view'], data?: RouterControllerState['data']) {
    if (view !== state.view) {
      state.view = view;
      state.history.push(view);
      state.data = data;
    }
  },

  reset(view: RouterControllerState['view']) {
    state.view = view;
    state.history = [view];
  },

  replace(view: RouterControllerState['view'], data?: RouterControllerState['data']) {
    if (state.history.length > 1 && state.history.at(-1) !== view) {
      state.view = view;
      state.history[state.history.length - 1] = view;
      state.data = data;
    }
  },

  goBack() {
    if (state.history.length > 1) {
      state.history.pop();
      const [last] = state.history.slice(-1);
      if (last) {
        state.view = last;
      }
    }
  }
};
