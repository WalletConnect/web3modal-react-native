import { subscribeKey as subKey } from 'valtio/utils';
import { proxy, ref } from 'valtio';
import type { Connector } from '../utils/TypeUtil';

// -- Types --------------------------------------------- //
export interface ConnectorControllerState {
  connectors: Connector[];
}

type StateKey = keyof ConnectorControllerState;

// -- State --------------------------------------------- //
const state = proxy<ConnectorControllerState>({
  connectors: []
});

// -- Controller ---------------------------------------- //
export const ConnectorController = {
  state,

  subscribeKey<K extends StateKey>(key: K, callback: (value: ConnectorControllerState[K]) => void) {
    return subKey(state, key, callback);
  },

  setConnectors(connectors: ConnectorControllerState['connectors']) {
    state.connectors = connectors.map(c => ref(c));
  },

  addConnector(connector: Connector) {
    state.connectors.push(ref(connector));
  },

  getConnectors() {
    return state.connectors;
  },

  getEmailConnector() {
    return state.connectors.find(c => c.type === 'EMAIL');
  }
};
