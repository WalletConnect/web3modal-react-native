import { useSnapshot } from 'valtio';
import { ScrollView } from 'react-native';
import { CardSelect, FlexView } from '@web3modal/ui-react-native';
import {
  ApiController,
  AssetUtil,
  NetworkController,
  RouterController,
  type CaipNetwork,
  AccountController
} from '@web3modal/core-react-native';

export function NetworksView() {
  const { isConnected } = useSnapshot(AccountController.state);
  const { caipNetwork, requestedCaipNetworks, approvedCaipNetworkIds, supportsAllNetworks } =
    useSnapshot(NetworkController.state);
  const imageHeaders = ApiController._getApiHeaders();

  const networksTemplate = () => {
    if (!requestedCaipNetworks?.length) return undefined;

    const onNetworkPress = async (network: CaipNetwork) => {
      if (isConnected) {
        if (caipNetwork?.id !== network.id) {
          await NetworkController.switchActiveNetwork(network);
          RouterController.goBack();
        } else if (supportsAllNetworks) {
          //TODO: Switch network screen
        }
      } else {
        NetworkController.setCaipNetwork(network);
        RouterController.push('Connect');
      }
    };

    return requestedCaipNetworks.map(network => (
      <CardSelect
        key={network.id}
        name={network.name ?? 'Unknown'}
        type="network"
        imageSrc={AssetUtil.getNetworkImage(network)}
        imageHeaders={imageHeaders}
        disabled={!supportsAllNetworks && approvedCaipNetworkIds?.includes(network.id)}
        selected={caipNetwork?.id === network.id}
        onPress={() => onNetworkPress(network)}
      />
    ));
  };

  return (
    <ScrollView bounces={false} fadingEdgeLength={20}>
      <FlexView flexDirection="row" flexWrap="wrap" gap="xs" padding="s" justifyContent="center">
        {networksTemplate()}
      </FlexView>
    </ScrollView>
  );
}
