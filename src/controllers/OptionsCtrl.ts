import { proxy } from 'valtio';

import type { OptionsCtrlState } from '../types/controllerTypes';
import { ClientCtrl } from './ClientCtrl';

// -- initial state ------------------------------------------------ //
const state = proxy<OptionsCtrlState>({
  isDataLoaded: false,
  namespace: 'eip155',
  selectedChain: undefined,
  chains: undefined,
});

// -- controller --------------------------------------------------- //
export const OptionsCtrl = {
  state,

  setIsDataLoaded(isDataLoaded: OptionsCtrlState['isDataLoaded']) {
    state.isDataLoaded = isDataLoaded;
  },

  getSelectedChain() {
    const namespace = state.namespace;
    const selectedChain =
      ClientCtrl.state.provider?.rpcProviders[namespace]?.getDefaultChain();
    if (selectedChain) {
      state.selectedChain = selectedChain;
    }

    return state.selectedChain;
  },

  setSelectedChain(selectedChain: OptionsCtrlState['selectedChain']) {
    const namespace = state.namespace;
    if (selectedChain) {
      ClientCtrl.state.provider?.setDefaultChain(
        `${namespace}:${selectedChain}`
      );
      state.selectedChain = selectedChain;
    }
  },

  setChains(chains: OptionsCtrlState['chains']) {
    state.chains = chains;
  },

  getNamespace() {
    return state.namespace;
  },
};
