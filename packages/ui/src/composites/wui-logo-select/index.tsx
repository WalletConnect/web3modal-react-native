import { Animated, Pressable } from 'react-native';
import useAnimatedValue from '../../hooks/useAnimatedValue';
import useTheme from '../../hooks/useTheme';
import { LogoType } from '../../utils/TypesUtil';
import { Logo } from '../wui-logo';
import styles from './styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface LogoSelectProps {
  logo: LogoType;
  disabled?: boolean;
}

export function LogoSelect({ logo, disabled }: LogoSelectProps) {
  const Theme = useTheme();
  const { animatedValue, setStartValue, setEndValue } = useAnimatedValue(
    Theme['overlay-005'],
    Theme['overlay-010']
  );

  return (
    <AnimatedPressable
      onPressIn={setEndValue}
      onPressOut={setStartValue}
      style={[styles.box, { backgroundColor: animatedValue }]}
      disabled={disabled}
    >
      <Logo logo={logo} style={disabled && styles.disabled} />
    </AnimatedPressable>
  );
}