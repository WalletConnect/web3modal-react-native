import { FlatList, StyleSheet, View } from 'react-native';
import { useSnapshot } from 'valtio';
import NavHeader from '../components/NavHeader';
import { OptionsCtrl } from '../controllers/OptionsCtrl';
import { ChainPresets } from '../presets/ChainPresets';
import { ThemeCtrl } from '../controllers/ThemeCtrl';
import type { RouterProps } from '../types/routerTypes';

import { RouterCtrl } from '../controllers/RouterCtrl';
import ChainItem from '../components/ChainItem';

function NetworkSwitch({ isPortrait, windowWidth }: RouterProps) {
  const { namespace, selectedChain, chains } = useSnapshot(OptionsCtrl.state);
  const themeState = useSnapshot(ThemeCtrl.state);
  const chainPresets = ChainPresets[namespace];

  // TODO: Check if there's a key not present in the presets
  const mappedChains = chainPresets
    ? Object.keys(chainPresets)
        .map((key) => ({
          id: key,
          name: chainPresets[key]?.name ?? '',
          icon: chainPresets[key]?.icon ?? '',
          supported: chains?.includes(key) || false,
        }))
        .sort((a, b) =>
          a.supported === b.supported ? 0 : a.supported ? -1 : 1
        )
    : [];

  const activeChain = selectedChain ? chainPresets?.[selectedChain] : undefined;

  const onChainPress = (chainId: string) => {
    OptionsCtrl.setSelectedChain(chainId);
    RouterCtrl.goBack();
  };

  return (
    <View>
      <NavHeader title="Select network" />
      <FlatList
        data={mappedChains}
        contentContainerStyle={styles.listContent}
        indicatorStyle={themeState.themeMode === 'dark' ? 'white' : 'black'}
        showsVerticalScrollIndicator
        numColumns={isPortrait ? 4 : 6}
        key={isPortrait ? 'portrait' : 'landscape'}
        renderItem={({ item }) => (
          <ChainItem
            chain={item}
            isPortrait={isPortrait}
            isActive={item.name === activeChain?.name ?? false}
            onChainPress={onChainPress}
            windowWidth={windowWidth}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NetworkSwitch;
