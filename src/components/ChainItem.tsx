import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { ExplorerCtrl } from '../controllers/ExplorerCtrl';
import useTheme from '../hooks/useTheme';
import Web3Text from './Web3Text';

interface Props {
  isActive: boolean;
  onChainPress: (chainId: string) => void;
  windowWidth: number;
  isPortrait: boolean;
  chain: {
    id: string;
    name: string;
    icon: string;
    supported: boolean;
  };
}

function ChainItem({
  onChainPress,
  isActive,
  isPortrait,
  windowWidth,
  chain,
}: Props) {
  const Theme = useTheme();
  const imageUrl = ExplorerCtrl.getAssetImageUrl(chain.icon);
  return (
    <TouchableOpacity
      onPress={() => onChainPress(chain.id)}
      disabled={!chain.supported}
      style={[
        styles.container,
        { width: isPortrait ? windowWidth / 4 : windowWidth / 7 },
        isActive && {
          backgroundColor: Theme.background3,
        },
        !chain.supported && styles.unsupportedContainer,
      ]}
    >
      <Image source={{ uri: imageUrl }} style={styles.logo} />
      <Web3Text
        numberOfLines={1}
        style={[
          styles.name,
          {
            maxWidth: isPortrait ? windowWidth / 4 - 20 : windowWidth / 7 - 20,
          },
        ]}
      >
        {chain.name}
      </Web3Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 4,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unsupportedContainer: {
    opacity: 0.25,
  },
  logo: {
    height: 60,
    width: 60,
    borderRadius: 8,
    marginBottom: 4,
  },
  name: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ChainItem;
