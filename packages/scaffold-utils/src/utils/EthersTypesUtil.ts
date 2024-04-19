import type { W3mFrameProvider } from '@web3modal/core-react-native';
export type { W3mFrameProvider } from '@web3modal/core-react-native';

export interface IEthersConfig {
  providers: ProviderType;
  defaultChain?: number;
}

export type Address = `0x${string}`;

export type ProviderType = {
  metadata: Metadata;
  extraConnectors?: (Provider | W3mFrameProvider)[];
};

export interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

export interface Provider {
  readonly id: string;
  readonly name: string;
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

export type CombinedProviderType = Provider & W3mFrameProvider;

export type Chain = {
  rpcUrl: string;
  explorerUrl: string;
  currency: string;
  name: string;
  chainId: number;
};
