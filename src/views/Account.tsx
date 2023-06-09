import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSnapshot } from 'valtio';

import CopyIcon from '../assets/Copy';
import { AccountCtrl } from '../controllers/AccountCtrl';
import { UiUtil } from '../utils/UiUtil';
import Web3Text from '../components/Web3Text';
import type { RouterProps } from 'src/types/routerTypes';
import Web3Avatar from '../components/Web3Avatar';
import ConnectionBadge from '../components/ConnectionBadge';
import useTheme from '../hooks/useTheme';
import Backward from '../assets/Backward';
import Link from '../components/Link';
import { RouterCtrl } from '../controllers/RouterCtrl';

export function Account({ onCopyClipboard }: RouterProps) {
  const Theme = useTheme();
  const accountState = useSnapshot(AccountCtrl.state);

  const onNetworkPress = () => {
    RouterCtrl.push('NetworkSwitch');
  };

  const onCopy = () => {
    if (onCopyClipboard && accountState.address) {
      onCopyClipboard(accountState.address);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Web3Avatar
              address={accountState.address ?? ''}
              style={styles.avatar}
            />
            <View style={styles.row}>
              <Web3Text style={styles.address}>
                {UiUtil.truncate(accountState.address ?? '')}
              </Web3Text>
              {onCopyClipboard && (
                <TouchableOpacity onPress={onCopy} style={styles.button}>
                  <CopyIcon height={14} width={14} fill={Theme.foreground3} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ConnectionBadge />
        </View>
        <View style={styles.footer}>
          <Link
            label="Network"
            onPress={onNetworkPress}
            icon={
              <Backward
                height={12}
                fill={Theme.accent}
                style={styles.networkIcon}
              />
            }
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    alignItems: 'flex-end',
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 100,
    marginBottom: 10,
  },
  address: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  networkIcon: {
    marginLeft: 5,
    transform: [{ rotateZ: '180deg' }],
  },
});
