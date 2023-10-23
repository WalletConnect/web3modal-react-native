import { useSnapshot } from 'valtio';
import { useCallback } from 'react';
import { Linking } from 'react-native';
import {
  RouterController,
  ApiController,
  AssetUtil,
  ConnectionController,
  CoreHelperUtil
} from '@web3modal/core-react-native';
import {
  Button,
  FlexView,
  LoadingThumbnail,
  Text,
  WalletImage,
  Link,
  IconBox
} from '@web3modal/ui-react-native';

import styles from './styles';

interface ConnectingWebProps {
  onCopyUri: (uri?: string) => void;
}

export function ConnectingWeb({ onCopyUri }: ConnectingWebProps) {
  const { data } = useSnapshot(RouterController.state);
  const { wcUri, wcError } = useSnapshot(ConnectionController.state);

  const onConnect = useCallback(async () => {
    try {
      const { name, webapp_link } = data?.wallet ?? {};
      if (name && webapp_link && wcUri) {
        ConnectionController.setWcError(false);
        const { redirect, href } = CoreHelperUtil.formatUniversalUrl(webapp_link, wcUri);
        ConnectionController.setWcLinking({ name, href });
        ConnectionController.setPressedWallet(data?.wallet);
        await Linking.openURL(redirect);
      }
    } catch {}
  }, [data?.wallet, wcUri]);

  const textTemplate = () => {
    const walletName = data?.wallet?.name ?? 'Wallet';
    if (wcError) {
      return (
        <>
          <Text variant="paragraph-500" color="error-100">
            Connection declined
          </Text>
          <Text center variant="small-500" color="fg-200" style={styles.descriptionText}>
            Connection can be declined if a previous request is still active
          </Text>
        </>
      );
    }

    return (
      <>
        <Text variant="paragraph-500">{`Continue in ${walletName}`}</Text>
        <Text center variant="small-500" color="fg-200" style={styles.descriptionText}>
          Open and continue in a browser tab
        </Text>
      </>
    );
  };

  return (
    <FlexView alignItems="center" rowGap="xs" padding={['2xl', 'm', '2xl', 'm']}>
      <LoadingThumbnail pause={wcError}>
        <WalletImage
          size="lg"
          imageSrc={AssetUtil.getWalletImage(data?.wallet)}
          imageHeaders={ApiController._getApiHeaders()}
        />
        {wcError && (
          <IconBox
            icon={'close'}
            border
            background
            backgroundColor="icon-box-bg-error-100"
            size="md"
            iconColor="error-100"
            style={styles.errorIcon}
          />
        )}
      </LoadingThumbnail>
      {textTemplate()}
      <Button
        variant="accent"
        iconLeft="externalLink"
        style={styles.openButton}
        onPress={onConnect}
      >
        Open
      </Button>
      <Link
        iconLeft="copy"
        color="fg-200"
        style={styles.copyButton}
        onPress={() => onCopyUri(wcUri)}
      >
        Copy link
      </Link>
    </FlexView>
  );
}