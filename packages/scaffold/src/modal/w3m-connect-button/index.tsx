import { useSnapshot } from 'valtio';
import { ModalController } from '@web3modal/core-react-native';
import { ConnectButton, type ConnectButtonProps } from '@web3modal/ui-react-native';

export interface W3mConnectButtonProps {
  label: string;
  loadingLabel: string;
  size?: ConnectButtonProps['size'];
  style?: ConnectButtonProps['style'];
  testID?: string;
}

export function W3mConnectButton({
  label,
  loadingLabel,
  size = 'md',
  style,
  testID
}: W3mConnectButtonProps) {
  const { open, loading } = useSnapshot(ModalController.state);

  return (
    <ConnectButton
      onPress={() => ModalController.open()}
      size={size}
      loading={open || loading}
      style={style}
      testID={testID}
    >
      {open ? loadingLabel : label}
    </ConnectButton>
  );
}
