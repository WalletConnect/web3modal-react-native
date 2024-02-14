import './config/animations';

import type {
  AccountControllerState,
  ConnectionControllerClient,
  ModalControllerState,
  NetworkControllerClient,
  NetworkControllerState,
  OptionsControllerState,
  EventsControllerState,
  PublicStateControllerState,
  ThemeControllerState,
  ThemeMode,
  ThemeVariables,
  Connector
} from '@web3modal/core-react-native';
import {
  AccountController,
  BlockchainApiController,
  ConnectionController,
  ConnectorController,
  EventsController,
  ModalController,
  NetworkController,
  OptionsController,
  PublicStateController,
  StorageUtil,
  ThemeController
} from '@web3modal/core-react-native';

// -- Types ---------------------------------------------------------------------
export interface LibraryOptions {
  projectId: OptionsControllerState['projectId'];
  themeMode?: ThemeMode;
  themeVariables?: ThemeVariables;
  includeWalletIds?: OptionsControllerState['includeWalletIds'];
  excludeWalletIds?: OptionsControllerState['excludeWalletIds'];
  featuredWalletIds?: OptionsControllerState['featuredWalletIds'];
  customWallets?: OptionsControllerState['customWallets'];
  defaultChain?: NetworkControllerState['caipNetwork'];
  tokens?: OptionsControllerState['tokens'];
  clipboardClient?: OptionsControllerState['_clipboardClient'];
  enableAnalytics?: OptionsControllerState['enableAnalytics'];
  _sdkVersion: OptionsControllerState['sdkVersion'];
}

export interface ScaffoldOptions extends LibraryOptions {
  networkControllerClient: NetworkControllerClient;
  connectionControllerClient: ConnectionControllerClient;
}

export interface OpenOptions {
  view: 'Account' | 'Connect' | 'Networks';
}

// -- Client --------------------------------------------------------------------
export class Web3ModalScaffold {
  public constructor(options: ScaffoldOptions) {
    this.initControllers(options);
  }

  // -- Public -------------------------------------------------------------------
  public async open(options?: OpenOptions) {
    ModalController.open(options);
  }

  public async close() {
    ModalController.close();
  }

  public getThemeMode() {
    return ThemeController.state.themeMode;
  }

  public getThemeVariables() {
    return ThemeController.state.themeVariables;
  }

  public setThemeMode(themeMode: ThemeControllerState['themeMode']) {
    ThemeController.setThemeMode(themeMode);
  }

  public setThemeVariables(themeVariables: ThemeControllerState['themeVariables']) {
    ThemeController.setThemeVariables(themeVariables);
  }

  public subscribeTheme(callback: (newState: ThemeControllerState) => void) {
    return ThemeController.subscribe(callback);
  }

  public getState() {
    return { ...PublicStateController.state };
  }

  public subscribeState(callback: (newState: PublicStateControllerState) => void) {
    return PublicStateController.subscribe(callback);
  }

  public subscribeStateKey<K extends keyof PublicStateControllerState>(
    key: K,
    callback: (value: PublicStateControllerState[K]) => void
  ) {
    return PublicStateController.subscribeKey(key, callback);
  }

  public subscribeConnection(
    callback: (isConnected: AccountControllerState['isConnected']) => void
  ) {
    return AccountController.subscribeConnection(callback);
  }

  public setLoading(loading: ModalControllerState['loading']) {
    ModalController.setLoading(loading);
  }

  public getEvent() {
    return { ...EventsController.state };
  }

  public subscribeEvents(callback: (newEvent: EventsControllerState) => void) {
    return EventsController.subscribe(callback);
  }

  // -- Protected ----------------------------------------------------------------
  protected setIsConnected: (typeof AccountController)['setIsConnected'] = isConnected => {
    AccountController.setIsConnected(isConnected);
  };

  protected setCaipAddress: (typeof AccountController)['setCaipAddress'] = caipAddress => {
    AccountController.setCaipAddress(caipAddress);
  };

  protected setBalance: (typeof AccountController)['setBalance'] = (balance, balanceSymbol) => {
    AccountController.setBalance(balance, balanceSymbol);
  };

  protected setProfileName: (typeof AccountController)['setProfileName'] = profileName => {
    AccountController.setProfileName(profileName);
  };

  protected setProfileImage: (typeof AccountController)['setProfileImage'] = profileImage => {
    AccountController.setProfileImage(profileImage);
  };

  protected resetAccount: (typeof AccountController)['resetAccount'] = () => {
    AccountController.resetAccount();
  };

  protected setCaipNetwork: (typeof NetworkController)['setCaipNetwork'] = caipNetwork => {
    NetworkController.setCaipNetwork(caipNetwork);
  };

  protected getCaipNetwork = () => NetworkController.state.caipNetwork;

  protected setRequestedCaipNetworks: (typeof NetworkController)['setRequestedCaipNetworks'] =
    requestedCaipNetworks => {
      NetworkController.setRequestedCaipNetworks(requestedCaipNetworks);
    };

  protected getApprovedCaipNetworksData: (typeof NetworkController)['getApprovedCaipNetworksData'] =
    () => NetworkController.getApprovedCaipNetworksData();

  protected resetNetwork: (typeof NetworkController)['resetNetwork'] = () => {
    NetworkController.resetNetwork();
  };

  protected setConnectors: (typeof ConnectorController)['setConnectors'] = (
    connectors: Connector[]
  ) => {
    ConnectorController.setConnectors(connectors);
  };

  protected addConnector: (typeof ConnectorController)['addConnector'] = (connector: Connector) => {
    ConnectorController.addConnector(connector);
  };

  protected getConnectors: (typeof ConnectorController)['getConnectors'] = () =>
    ConnectorController.getConnectors();

  protected resetWcConnection: (typeof ConnectionController)['resetWcConnection'] = () => {
    ConnectionController.resetWcConnection();
  };

  protected fetchIdentity: (typeof BlockchainApiController)['fetchIdentity'] = request =>
    BlockchainApiController.fetchIdentity(request);

  protected setAddressExplorerUrl: (typeof AccountController)['setAddressExplorerUrl'] =
    addressExplorerUrl => {
      AccountController.setAddressExplorerUrl(addressExplorerUrl);
    };

  // -- Private ------------------------------------------------------------------
  private initControllers(options: ScaffoldOptions) {
    this.initRecentWallets(options);
    NetworkController.setClient(options.networkControllerClient);
    NetworkController.setDefaultCaipNetwork(options.defaultChain);

    OptionsController.setProjectId(options.projectId);
    OptionsController.setIncludeWalletIds(options.includeWalletIds);
    OptionsController.setExcludeWalletIds(options.excludeWalletIds);
    OptionsController.setFeaturedWalletIds(options.featuredWalletIds);
    OptionsController.setTokens(options.tokens);
    OptionsController.setCustomWallets(options.customWallets);
    OptionsController.setEnableAnalytics(options.enableAnalytics);
    OptionsController.setSdkVersion(options._sdkVersion);

    if (options.clipboardClient) {
      OptionsController.setClipboardClient(options.clipboardClient);
    }

    ConnectionController.setClient(options.connectionControllerClient);

    if (options.themeMode) {
      ThemeController.setThemeMode(options.themeMode);
    }
    if (options.themeVariables) {
      ThemeController.setThemeVariables(options.themeVariables);
    }
  }

  private async initRecentWallets(options: ScaffoldOptions) {
    const wallets = await StorageUtil.getRecentWallets();

    const filteredWallets = wallets.filter(wallet => {
      const { includeWalletIds, excludeWalletIds } = options;
      if (includeWalletIds) {
        return includeWalletIds.includes(wallet.id);
      }
      if (excludeWalletIds) {
        return !excludeWalletIds.includes(wallet.id);
      }

      return true;
    });

    ConnectionController.setRecentWallets(filteredWallets);
  }
}
