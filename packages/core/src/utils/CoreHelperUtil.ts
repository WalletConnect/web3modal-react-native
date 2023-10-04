import { Linking } from 'react-native';
import { ConstantsUtil } from './ConstantsUtil';
import type { CaipAddress, LinkingRecord } from './TypeUtils';

export const CoreHelperUtil = {
  isPairingExpired(expiry?: number) {
    return expiry ? expiry - Date.now() <= ConstantsUtil.TEN_SEC_MS : true;
  },

  isAllowedRetry(lastRetry: number) {
    return Date.now() - lastRetry >= ConstantsUtil.ONE_SEC_MS;
  },

  copyToClopboard(/*text: string*/) {
    // navigator.clipboard.writeText(text)
  },

  getPairingExpiry() {
    return Date.now() + ConstantsUtil.FOUR_MINUTES_MS;
  },

  getPlainAddress(caipAddress: CaipAddress) {
    return caipAddress.split(':')[2];
  },

  async wait(milliseconds: number) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debounce(func: (...args: any[]) => unknown, timeout = 500) {
    let timer: ReturnType<typeof setTimeout> | undefined = undefined;

    return (...args: unknown[]) => {
      function next() {
        func(...args);
      }
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(next, timeout);
    };
  },

  isHttpUrl(url: string) {
    return url.startsWith('http://') || url.startsWith('https://');
  },

  formatNativeUrl(appUrl: string, wcUri: string): LinkingRecord {
    if (CoreHelperUtil.isHttpUrl(appUrl)) {
      return this.formatUniversalUrl(appUrl, wcUri);
    }
    let safeAppUrl = appUrl;
    if (!safeAppUrl.includes('://')) {
      safeAppUrl = appUrl.replaceAll('/', '').replaceAll(':', '');
      safeAppUrl = `${safeAppUrl}://`;
    }
    if (!safeAppUrl.endsWith('/')) {
      safeAppUrl = `${safeAppUrl}/`;
    }
    const encodedWcUrl = encodeURIComponent(wcUri);

    return {
      redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
      href: safeAppUrl
    };
  },

  formatUniversalUrl(appUrl: string, wcUri: string): LinkingRecord {
    if (!CoreHelperUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri);
    }
    let safeAppUrl = appUrl;
    if (!safeAppUrl.endsWith('/')) {
      safeAppUrl = `${safeAppUrl}/`;
    }
    const encodedWcUrl = encodeURIComponent(wcUri);

    return {
      redirect: `${safeAppUrl}wc?uri=${encodedWcUrl}`,
      href: safeAppUrl
    };
  },

  openLink(url: string) {
    Linking.openURL(url);
  },

  formatBalance(balance: string | undefined, symbol: string | undefined, decimals = 3) {
    let formattedBalance = undefined;

    if (balance === '0') {
      formattedBalance = '0';
    } else if (typeof balance === 'string') {
      const number = Number(balance);
      if (number) {
        const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`, 'u');
        formattedBalance = number.toString().match(regex)?.[0];
      }
    }

    return formattedBalance ? `${formattedBalance} ${symbol}` : '0.000';
  },

  isRestrictedRegion() {
    try {
      const { timeZone } = new Intl.DateTimeFormat().resolvedOptions();
      const capTimeZone = timeZone.toUpperCase();

      return ConstantsUtil.RESTRICTED_TIMEZONES.includes(capTimeZone);
    } catch {
      return false;
    }
  },

  getApiUrl() {
    return CoreHelperUtil.isRestrictedRegion()
      ? 'https://api.web3modal.org'
      : 'https://api.web3modal.com';
  },

  getBlockchainApiUrl() {
    return CoreHelperUtil.isRestrictedRegion()
      ? 'https://rpc.walletconnect.org'
      : 'https://rpc.walletconnect.com';
  }
};
