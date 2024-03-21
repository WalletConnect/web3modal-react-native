import type { W3mFrameProvider } from '@web3modal/email-react-native';

export interface IEthersConfig {
  providers: ProviderType;
  defaultChain?: number;
}

export type Address = `0x${string}`;

export type ProviderType = {
  metadata: Metadata;
  coinbase?: Provider;
  email?: boolean;
};

export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export interface Provider {
  request: <T>(args: RequestArguments) => Promise<T>;
  on: <T>(event: string, listener: (data: T) => void) => void;
  removeListener: <T>(event: string, listener: (data: T) => void) => void;
  emit: (event: string) => void;
}

export type Metadata = {
  name: string;
  description: string;
  url: string;
  icons: string[];
  redirect: {
    native: string;
    universal?: string;
  };
};

export type CombinedProvider = W3mFrameProvider & Provider;
export type Chain = {
  rpcUrl: string;
  explorerUrl: string;
  currency: string;
  name: string;
  chainId: number;
};
