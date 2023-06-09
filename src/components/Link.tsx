import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import Web3Text from './Web3Text';
import useTheme from '../hooks/useTheme';

interface Props {
  label: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  icon?: React.ReactNode;
}

function Link({ label, style, onPress, icon }: Props) {
  const Theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Web3Text style={[{ color: Theme.accent }, styles.text]}>
        {label}
      </Web3Text>
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Link;
