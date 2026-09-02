import type { SocialProvider } from '@reown/appkit-common-react-native';

import { CoreHelperUtil } from '../../utils/CoreHelperUtil';
import { OptionsController } from '../../controllers/OptionsController';

const WEB_WALLET_URL = 'https://web-wallet.walletconnect.org';
const WC_URI = 'wc:topic@2?relay-protocol=irn&symKey=key';
const ENCODED_WC_URI = encodeURIComponent(WC_URI);

describe('CoreHelperUtil', () => {
  afterEach(() => {
    OptionsController.setProjectId('');
  });

  describe('formatUniversalUrl', () => {
    it('should add the encoded provider and project id for social login', () => {
      OptionsController.setProjectId('test-project-id');
      const { redirect, href } = CoreHelperUtil.formatUniversalUrl(
        WEB_WALLET_URL,
        WC_URI,
        'google'
      );
      expect(redirect).toBe(
        `${WEB_WALLET_URL}/wc?uri=${ENCODED_WC_URI}&provider=google&projectId=test-project-id`
      );
      expect(href).toBe(`${WEB_WALLET_URL}/`);
    });

    it('should encode special characters in the provider and project id', () => {
      OptionsController.setProjectId('proj+id=1&x');
      const { redirect } = CoreHelperUtil.formatUniversalUrl(
        WEB_WALLET_URL,
        WC_URI,
        'email+test' as SocialProvider
      );
      expect(redirect).toBe(
        `${WEB_WALLET_URL}/wc?uri=${ENCODED_WC_URI}&provider=email%2Btest&projectId=proj%2Bid%3D1%26x`
      );
    });

    it('should omit the project id when it is blank', () => {
      OptionsController.setProjectId('  ');
      const { redirect } = CoreHelperUtil.formatUniversalUrl(WEB_WALLET_URL, WC_URI, 'email');
      expect(redirect).toBe(`${WEB_WALLET_URL}/wc?uri=${ENCODED_WC_URI}&provider=email`);
    });

    it('should not add the project id without a provider', () => {
      OptionsController.setProjectId('test-project-id');
      const { redirect } = CoreHelperUtil.formatUniversalUrl('https://wallet.example.com', WC_URI);
      expect(redirect).toBe(`https://wallet.example.com/wc?uri=${ENCODED_WC_URI}`);
    });
  });

  describe('formatNativeUrl', () => {
    it('should not add the project id to a native deep link', () => {
      OptionsController.setProjectId('test-project-id');
      const { redirect, href } = CoreHelperUtil.formatNativeUrl('wallet://', WC_URI);
      expect(redirect).toBe(`wallet://wc?uri=${ENCODED_WC_URI}`);
      expect(href).toBe('wallet://');
    });

    it('should not add the project id to a universal deep link', () => {
      OptionsController.setProjectId('test-project-id');
      const { redirect } = CoreHelperUtil.formatNativeUrl('https://wallet.example.com', WC_URI);
      expect(redirect).toBe(`https://wallet.example.com/wc?uri=${ENCODED_WC_URI}`);
    });
  });
});
