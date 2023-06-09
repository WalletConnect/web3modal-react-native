import type {
  ConnectParams,
  Metadata,
  IUniversalProvider,
} from '@walletconnect/universal-provider';

export interface IProvider extends IUniversalProvider {
  //remove this when IUniversalProvider is updated
  setDefaultChain: (chainId: string, rpcUrl?: string | undefined) => void;
}

export interface IProviderMetadata extends Metadata {
  redirect: {
    native: string;
    universal?: string;
  };
}

export type ISessionParams = ConnectParams;
