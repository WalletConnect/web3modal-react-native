export const CoreUtil = {
  isHttpUrl(url: string) {
    return url.startsWith('http://') || url.startsWith('https://');
  },

  formatNativeUrl(appUrl: string, wcUri: string): string | undefined {
    if (!appUrl) return undefined;

    if (CoreUtil.isHttpUrl(appUrl)) {
      return this.formatUniversalUrl(appUrl, wcUri);
    }
    let safeAppUrl = appUrl;
    if (!safeAppUrl.includes('://')) {
      safeAppUrl = appUrl.replaceAll('/', '').replaceAll(':', '');
      safeAppUrl = `${safeAppUrl}://`;
    }

    const encodedWcUrl = encodeURIComponent(wcUri);

    return `${safeAppUrl}wc?uri=${encodedWcUrl}`;
  },

  formatUniversalUrl(appUrl: string, wcUri: string): string | undefined {
    if (!appUrl) return undefined;

    if (!CoreUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri);
    }
    let plainAppUrl = appUrl;
    if (appUrl.endsWith('/')) {
      plainAppUrl = appUrl.slice(0, -1);
    }

    const encodedWcUrl = encodeURIComponent(wcUri);

    return `${plainAppUrl}/wc?uri=${encodedWcUrl}`;
  },

  getAvailableChains(accounts?: string[]): string[] {
    if (!accounts) return [];

    //TODO: check if all accounts come with the same format e.g. eip155:1:0x1234
    const chains = accounts
      .filter((account) => account.includes(':'))
      .map((account) => {
        const chain = account.split(':')[1];
        return chain!;
      });

    return chains || [];
  },
};
