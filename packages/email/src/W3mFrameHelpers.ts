import { CoreHelperUtil } from '@web3modal/core-react-native';
import { W3mFrameStorage } from './W3mFrameStorage';
import { W3mFrameConstants, W3mFrameRpcConstants } from './W3mFrameConstants';
import type { W3mFrameTypes } from './W3mFrameTypes';

const EMAIL_MINIMUM_TIMEOUT = 30 * 1000;

export const W3mFrameHelpers = {
  getBlockchainApiUrl() {
    return CoreHelperUtil.getBlockchainApiUrl();
  },

  async checkIfAllowedToTriggerEmail() {
    const lastEmailLoginTime = await W3mFrameStorage.get(W3mFrameConstants.LAST_EMAIL_LOGIN_TIME);
    if (lastEmailLoginTime) {
      const difference = Date.now() - Number(lastEmailLoginTime);
      if (difference < EMAIL_MINIMUM_TIMEOUT) {
        const cooldownSec = Math.ceil((EMAIL_MINIMUM_TIMEOUT - difference) / 1000);
        throw new Error(`Please try again after ${cooldownSec} seconds`);
      }
    }
  },

  checkIfRequestExists(request: unknown) {
    const method = this.getRequestMethod(request);

    return (
      W3mFrameRpcConstants.NOT_SAFE_RPC_METHODS.includes(method) ||
      W3mFrameRpcConstants.SAFE_RPC_METHODS.includes(method)
    );
  },

  getRequestMethod(request: unknown) {
    return (request as { payload: W3mFrameTypes.RPCRequest })?.payload?.method;
  },

  checkIfRequestIsAllowed(request: unknown) {
    const method = this.getRequestMethod(request);

    return W3mFrameRpcConstants.SAFE_RPC_METHODS.includes(method);
  }
};
