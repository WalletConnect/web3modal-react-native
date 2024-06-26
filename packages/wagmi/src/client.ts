import {
  type Address,
  type Chain,
  type Config,
  type Connector as WagmiConnector,
  connect,
  disconnect,
  fetchBalance,
  fetchEnsAvatar,
  fetchEnsName,
  getAccount,
  getNetwork,
  switchNetwork,
  watchAccount,
  watchNetwork
} from '@wagmi/core';
import { mainnet } from '@wagmi/core/chains';
import {
  type CaipAddress,
  type CaipNetwork,
  type CaipNetworkId,
  type ConnectionControllerClient,
  type Connector,
  type LibraryOptions,
  type NetworkControllerClient,
  type PublicStateControllerState,
  type Token,
  Web3ModalScaffold
} from '@web3modal/scaffold-react-native';
import {
  ConstantsUtil,
  HelpersUtil,
  PresetsUtil,
  StorageUtil
} from '@web3modal/scaffold-utils-react-native';
import {
  getCaipDefaultChain,
  getEmailCaipNetworks,
  getWalletConnectCaipNetworks
} from './utils/helpers';

// -- Types ---------------------------------------------------------------------
interface WagmiConfig extends Config<any, any> {
  connectors: WagmiConnector<any, any>[];
}

export interface Web3ModalClientOptions extends Omit<LibraryOptions, 'defaultChain' | 'tokens'> {
  wagmiConfig: WagmiConfig;
  chains?: Chain[];
  defaultChain?: Chain;
  chainImages?: Record<number, string>;
  connectorImages?: Record<string, string>;
  tokens?: Record<number, Token>;
}

export type Web3ModalOptions = Omit<Web3ModalClientOptions, '_sdkVersion'>;

// @ts-expect-error: Overriden state type is correct
interface Web3ModalState extends PublicStateControllerState {
  selectedNetworkId: number | undefined;
}

// -- Client --------------------------------------------------------------------
export class Web3Modal extends Web3ModalScaffold {
  private hasSyncedConnectedAccount = false;

  private options: Web3ModalClientOptions | undefined = undefined;

  public constructor(options: Web3ModalClientOptions) {
    const { wagmiConfig, chains, defaultChain, tokens, _sdkVersion, ...w3mOptions } = options;

    if (!wagmiConfig) {
      throw new Error('web3modal:constructor - wagmiConfig is undefined');
    }

    if (!w3mOptions.projectId) {
      throw new Error('web3modal:constructor - projectId is undefined');
    }

    const networkControllerClient: NetworkControllerClient = {
      switchCaipNetwork: async caipNetwork => {
        const chainId = HelpersUtil.caipNetworkIdToNumber(caipNetwork?.id);
        if (chainId) {
          await switchNetwork({ chainId });
        }
      },

      async getApprovedCaipNetworksData() {
        const walletChoice = await StorageUtil.getConnectedConnector();
        const walletConnectType =
          PresetsUtil.ConnectorTypesMap[ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID];

        const emailType = PresetsUtil.ConnectorTypesMap[ConstantsUtil.EMAIL_CONNECTOR_ID];

        if (walletChoice?.includes(walletConnectType)) {
          const connector = wagmiConfig.connectors.find(
            c => c.id === ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID
          );

          return getWalletConnectCaipNetworks(connector);
        } else if (emailType) {
          return getEmailCaipNetworks();
        }

        return { approvedCaipNetworkIds: undefined, supportsAllNetworks: true };
      }
    };

    const connectionControllerClient: ConnectionControllerClient = {
      connectWalletConnect: async onUri => {
        const connector = wagmiConfig.connectors.find(
          c => c.id === ConstantsUtil.WALLET_CONNECT_CONNECTOR_ID
        );
        if (!connector) {
          throw new Error(
            'connectionControllerClient:getWalletConnectUri - connector is undefined'
          );
        }

        connector.on('message', event => {
          if (event.type === 'display_uri') {
            onUri(event.data as string);
            connector.removeAllListeners();
          }
        });

        const chainId = HelpersUtil.caipNetworkIdToNumber(this.getCaipNetwork()?.id);
        await connect({ connector, chainId });
      },

      connectExternal: async ({ id }) => {
        const connector = wagmiConfig.connectors.find(c => c.id === id);
        if (!connector) {
          throw new Error('connectionControllerClient:connectExternal - connector is undefined');
        }

        const chainId = HelpersUtil.caipNetworkIdToNumber(this.getCaipNetwork()?.id);
        await connect({ connector, chainId });
      },

      disconnect
    };

    super({
      networkControllerClient,
      connectionControllerClient,
      defaultChain: getCaipDefaultChain(defaultChain),
      tokens: HelpersUtil.getCaipTokens(tokens),
      _sdkVersion: _sdkVersion ?? `react-native-wagmi-${ConstantsUtil.VERSION}`,
      ...w3mOptions
    });

    this.options = options;

    this.syncRequestedNetworks(chains);

    this.syncConnectors(wagmiConfig);
    this.syncEmailConnector(wagmiConfig);
    this.listenEmailConnector(wagmiConfig);

    watchAccount(() => this.syncAccount());
    watchNetwork(() => this.syncNetwork());
  }

  // -- Public ------------------------------------------------------------------

  // @ts-expect-error: Overriden state type is correct
  public override getState() {
    const state = super.getState();

    return {
      ...state,
      selectedNetworkId: HelpersUtil.caipNetworkIdToNumber(state.selectedNetworkId)
    };
  }

  // @ts-expect-error: Overriden state type is correct
  public override subscribeState(callback: (state: Web3ModalState) => void) {
    return super.subscribeState(state =>
      callback({
        ...state,
        selectedNetworkId: HelpersUtil.caipNetworkIdToNumber(state.selectedNetworkId)
      })
    );
  }

  // -- Private -----------------------------------------------------------------
  private syncRequestedNetworks(chains: Web3ModalClientOptions['chains']) {
    const requestedCaipNetworks = chains?.map(
      chain =>
        ({
          id: `${ConstantsUtil.EIP155}:${chain.id}`,
          name: chain.name,
          imageId: PresetsUtil.EIP155NetworkImageIds[chain.id],
          imageUrl: this.options?.chainImages?.[chain.id]
        }) as CaipNetwork
    );
    this.setRequestedCaipNetworks(requestedCaipNetworks ?? []);
  }

  private async syncAccount() {
    const { address, isConnected } = getAccount();
    const { chain } = getNetwork();
    this.resetAccount();
    if (isConnected && address && chain) {
      const caipAddress: CaipAddress = `${ConstantsUtil.EIP155}:${chain.id}:${address}`;
      this.setIsConnected(isConnected);
      this.setCaipAddress(caipAddress);
      await Promise.all([
        this.syncProfile(address),
        this.syncBalance(address, chain),
        this.getApprovedCaipNetworksData()
      ]);
      this.hasSyncedConnectedAccount = true;
    } else if (!isConnected && this.hasSyncedConnectedAccount) {
      this.resetWcConnection();
      this.resetNetwork();
    }
  }

  private async syncNetwork() {
    const { address, isConnected } = getAccount();
    const { chain } = getNetwork();

    if (chain) {
      const chainId = String(chain.id);
      const caipChainId: CaipNetworkId = `${ConstantsUtil.EIP155}:${chainId}`;
      this.setCaipNetwork({
        id: caipChainId,
        name: chain.name,
        imageId: PresetsUtil.EIP155NetworkImageIds[chain.id],
        imageUrl: this.options?.chainImages?.[chain.id]
      });
      if (isConnected && address) {
        const caipAddress: CaipAddress = `${ConstantsUtil.EIP155}:${chain.id}:${address}`;
        this.setCaipAddress(caipAddress);
        if (chain.blockExplorers?.default?.url) {
          const url = `${chain.blockExplorers.default.url}/address/${address}`;
          this.setAddressExplorerUrl(url);
        } else {
          this.setAddressExplorerUrl(undefined);
        }
        if (this.hasSyncedConnectedAccount) {
          await this.syncBalance(address, chain);
        }
      }
    }
  }

  private async syncProfile(address: Address) {
    try {
      const response = await this.fetchIdentity({
        caipChainId: `${ConstantsUtil.EIP155}:${mainnet.id}`,
        address
      });

      if (!response) {
        throw new Error('Couldnt fetch idendity');
      }

      const { name, avatar } = response;

      this.setProfileName(name);
      this.setProfileImage(avatar);
    } catch {
      const profileName = await fetchEnsName({ address, chainId: mainnet.id });
      if (profileName) {
        this.setProfileName(profileName);
        const profileImage = await fetchEnsAvatar({ name: profileName, chainId: mainnet.id });
        if (profileImage) {
          this.setProfileImage(profileImage);
        }
      }
    }
  }

  private async syncBalance(address: Address, chain: Chain) {
    const balance = await fetchBalance({
      address,
      chainId: chain.id,
      token: this.options?.tokens?.[chain.id]?.address as Address
    });
    this.setBalance(balance.formatted, balance.symbol);
  }

  private syncConnectors(wagmiConfig: Web3ModalClientOptions['wagmiConfig']) {
    const w3mConnectors: Connector[] = [];
    wagmiConfig.connectors.forEach(({ id, name }) => {
      if (![ConstantsUtil.EMAIL_CONNECTOR_ID].includes(id)) {
        w3mConnectors.push({
          id,
          explorerId: PresetsUtil.ConnectorExplorerIds[id],
          imageId: PresetsUtil.ConnectorImageIds[id],
          imageUrl: this.options?.connectorImages?.[id],
          name: PresetsUtil.ConnectorNamesMap[id] ?? name,
          type: PresetsUtil.ConnectorTypesMap[id] ?? 'EXTERNAL'
        });
      }
    });

    this.setConnectors(w3mConnectors);
  }

  private async syncEmailConnector(wagmiConfig: Web3ModalClientOptions['wagmiConfig']) {
    const emailConnector = wagmiConfig.connectors.find(
      ({ id }) => id === ConstantsUtil.EMAIL_CONNECTOR_ID
    );
    if (emailConnector) {
      const provider = await emailConnector.getProvider();
      this.addConnector({
        id: ConstantsUtil.EMAIL_CONNECTOR_ID,
        type: 'EMAIL',
        name: 'Email',
        provider
      });
    }
  }

  private async listenEmailConnector(wagmiConfig: Web3ModalClientOptions['wagmiConfig']) {
    const connector = wagmiConfig.connectors.find(c => c.id === ConstantsUtil.EMAIL_CONNECTOR_ID);

    const connectedConnector = await StorageUtil.getItem('@w3m/connected_connector');
    if (connector && connectedConnector === 'EMAIL') {
      super.setLoading(true);
    }
  }
}
