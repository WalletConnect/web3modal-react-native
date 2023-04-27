import '../../expo-crypto-shim.js';
import '@walletconnect/react-native-compat';
import '@ethersproject/shims';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Web3Modal, Web3Button, useWeb3Modal } from '@web3modal/react-native';
import { setStringAsync } from 'expo-clipboard';
import { ethers } from 'ethers';
import { Env } from '../../env';
import { testSendTransaction, testSignMessage } from '../utils/MethodUtil';
import { sessionParams, providerMetadata } from '../constants/Config';

export default function App() {
  const { isConnected, provider } = useWeb3Modal();
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();

  const onCopyClipboard = async (value: string) => {
    await setStringAsync(value).then(() => {
      Alert.alert('Copied', 'Copied to clipboard');
    });
  };

  useEffect(() => {
    if (!web3Provider && isConnected && provider) {
      setWeb3Provider(new ethers.providers.Web3Provider(provider));
    }
  }, [isConnected, provider, web3Provider]);

  return (
    <View style={styles.container}>
      <Web3Button />
      {isConnected && (
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => testSignMessage(web3Provider)}
          >
            <Text style={styles.text}>personal_sign</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => testSendTransaction(web3Provider)}
          >
            <Text style={styles.text}>eth_sendTransaction</Text>
          </TouchableOpacity>
        </View>
      )}
      <Web3Modal
        projectId={Env.PROJECT_ID}
        onCopyClipboard={onCopyClipboard}
        providerMetadata={providerMetadata}
        sessionParams={sessionParams}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    marginTop: 32,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3396FF',
    borderRadius: 20,
    width: 150,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 4,
  },
  text: {
    color: 'white',
    fontWeight: '700',
  },
});