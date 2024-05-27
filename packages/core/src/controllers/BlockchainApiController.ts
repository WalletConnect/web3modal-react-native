import { FetchUtil } from '../utils/FetchUtil';
import type {
  BlockchainApiIdentityRequest,
  BlockchainApiIdentityResponse
} from '../utils/TypeUtil';
import { OptionsController } from './OptionsController';

// -- Helpers ------------------------------------------- //
const api = new FetchUtil({ baseUrl: 'https://rpc.walletconnect.com' });

// -- Controller ---------------------------------------- //
export const BlockchainApiController = {
  fetchIdentity({ address }: BlockchainApiIdentityRequest) {
    return api.get<BlockchainApiIdentityResponse>({
      path: `/v1/identity/${address}`,
      params: {
        projectId: OptionsController.state.projectId
      }
    });
  }
};
