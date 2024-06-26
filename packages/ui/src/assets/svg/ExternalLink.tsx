import Svg, { Path, type SvgProps } from 'react-native-svg';
const SvgExternalLink = (props: SvgProps) => (
  <Svg viewBox="0 0 14 14" fill="none" {...props}>
    <Path
      fill={props.fill || '#fff'}
      fillRule="evenodd"
      d="M3.73838 3C3.73838 2.44772 4.18609 2 4.73838 2H10.9991C11.5513 2 11.9991 2.44772 11.9991 3V9.26067C11.9991 9.81296 11.5513 10.2607 10.9991 10.2607C10.4468 10.2607 9.99905 9.81296 9.99905 9.26067V5.41516L3.70711 11.7071C3.31658 12.0976 2.68342 12.0976 2.29289 11.7071C1.90237 11.3166 1.90237 10.6834 2.29289 10.2929L8.58579 4H4.73838C4.18609 4 3.73838 3.55228 3.73838 3Z"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgExternalLink;
