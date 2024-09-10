/* eslint-disable @typescript-eslint/no-unused-vars */

import { generateRandomBytes32 } from '@walletconnect/utils';
import {
  createSIWEConfig,
  formatMessage,
  type SIWEVerifyMessageArgs,
  type SIWECreateMessageArgs
} from '@reown/siwe-react-native';
import { chains } from './WagmiUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGGED_IN_KEY = '@w3mwagmi/logged_in';
const SESSION_KEY = '@w3mwagmi/session';

export const siweConfig = createSIWEConfig({
  signOutOnAccountChange: false,
  signOutOnNetworkChange: false,
  // We don't require any async action to populate params but other apps might

  getMessageParams: async () => {
    // Parameters to create the SIWE message internally.
    // More info in https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-222.method

    return {
      domain: 'com.walletconnect.web3modal.rnsample', //your bundle id or app id
      uri: 'redirect://', // your redirect uri
      chains: chains.map(chain => chain.id),
      statement: 'Please sign with your account',
      iat: new Date().toISOString()
    };
  },
  createMessage: ({ address, ...args }: SIWECreateMessageArgs): string => {
    // Method for generating an EIP-4361-compatible message.
    return formatMessage(args, address);
  },
  getNonce: async (): Promise<string> => {
    // The getNonce method functions as a safeguard
    // against spoofing, akin to a CSRF token.

    const nonce = generateRandomBytes32();

    return nonce;
  },
  getSession: async () => {
    // The backend session should store the associated address and chainId
    // and return it via the `getSession` method.

    const logged = await AsyncStorage.getItem(LOGGED_IN_KEY);
    if (logged === 'true') {
      const session = await AsyncStorage.getItem(SESSION_KEY);

      return session ? JSON.parse(session) : null;
    }

    return null;
  },

  verifyMessage: async ({ message, signature, cacao }: SIWEVerifyMessageArgs): Promise<boolean> => {
    // This function ensures the message is valid,
    // has not been tampered with, and has been appropriately
    // signed by the wallet address.

    // Call your sign-in backend function here and save the session
    // api.signIn({ message, signature, cacao });

    // Just a mock. You should save a token or whatever your backend needs
    await AsyncStorage.setItem(LOGGED_IN_KEY, 'true');

    // MOCKED LOGIC - DON'T COPY THIS
    const address = message.split('your Ethereum account:\n')[1].split('\n')[0];
    const chainId = message.split('Chain ID: ')[1].split('\n')[0];

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ address, chainId }));

    return true;
  },
  signOut: async (): Promise<boolean> => {
    // The users session must be destroyed when calling `signOut`.
    await AsyncStorage.removeItem(LOGGED_IN_KEY);

    return true;
  }
});
