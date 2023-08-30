import Svg, { Path, SvgProps } from 'react-native-svg';
const SvgSwapHorizontal = (props: SvgProps) => (
  <Svg viewBox="0 0 20 20" {...props} fill="none">
    <Path
      fill={props.fill || '#FFFFFF'}
      fillRule="evenodd"
      d="M6.76.3a1 1 0 0 1 0 1.4L4.07 4.4h9a1 1 0 1 1 0 2h-9l2.69 2.68a1 1 0 1 1-1.42 1.42L.95 6.09a1 1 0 0 1 0-1.4l4.4-4.4a1 1 0 0 1 1.4 0Zm6.49 9.21a1 1 0 0 1 1.41 0l4.39 4.4a1 1 0 0 1 0 1.4l-4.39 4.4a1 1 0 0 1-1.41-1.42l2.68-2.68h-9a1 1 0 0 1 0-2h9l-2.68-2.68a1 1 0 0 1 0-1.42Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgSwapHorizontal;