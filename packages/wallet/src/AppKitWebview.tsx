import { useSnapshot } from 'valtio';
import { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import {
  ConnectionController,
  ConnectorController,
  ModalController,
  RouterController,
  SnackController,
  WebviewController
} from '@reown/appkit-core-react-native';
import { useTheme, BorderRadius, IconLink, Spacing } from '@reown/appkit-ui-react-native';
import type { AppKitFrameProvider } from './AppKitFrameProvider';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export function AppKitWebview() {
  const webviewRef = useRef<WebView>(null);
  const Theme = useTheme();
  const authConnector = ConnectorController.getAuthConnector();
  const { webviewVisible, webviewUrl, connectingProvider } = useSnapshot(WebviewController.state);
  const [isBackdropVisible, setIsBackdropVisible] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0));
  const backdropOpacity = useRef(new Animated.Value(0));
  const webviewOpacity = useRef(new Animated.Value(0));
  const provider = authConnector?.provider as AppKitFrameProvider;

  const show = animatedHeight.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '80%']
  });

  const onClose = () => {
    WebviewController.setWebviewVisible(false);
    WebviewController.setConnecting(false);
    WebviewController.setConnectingProvider(undefined);
    RouterController.goBack();
  };

  useEffect(() => {
    Animated.timing(animatedHeight.current, {
      toValue: webviewVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();

    Animated.timing(webviewOpacity.current, {
      toValue: webviewVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false
    }).start(({ finished }) => {
      if (finished && !webviewVisible) {
        WebviewController.setWebviewUrl('');
      }
    });

    if (webviewVisible) {
      setIsBackdropVisible(true);
    }

    Animated.timing(backdropOpacity.current, {
      toValue: webviewVisible ? 0.7 : 0,
      duration: 300,
      useNativeDriver: false
    }).start(() => setIsBackdropVisible(webviewVisible));
  }, [animatedHeight, backdropOpacity, webviewVisible, setIsBackdropVisible]);

  if (!webviewUrl) return null;

  return provider ? (
    <>
      <Animated.View
        style={[
          styles.backdrop,
          !isBackdropVisible && styles.hidden,
          { backgroundColor: Theme['inverse-000'], opacity: backdropOpacity.current }
        ]}
      />
      <AnimatedSafeAreaView
        style={[
          styles.container,
          { backgroundColor: Theme['bg-100'], height: show, opacity: webviewOpacity.current }
        ]}
      >
        <IconLink
          icon="close"
          size="md"
          onPress={onClose}
          testID="button-close"
          style={styles.closeButton}
        />
        <WebView
          source={{
            uri: webviewUrl
          }}
          bounces={false}
          scalesPageToFit
          containerStyle={styles.webview}
          ref={webviewRef}
          onNavigationStateChange={async navState => {
            try {
              if (authConnector && navState.url.includes('/sdk/oauth')) {
                WebviewController.setWebviewVisible(false);
                const parsedUrl = new URL(navState.url);
                await provider?.connectSocial(parsedUrl.search);
                await ConnectionController.connectExternal(authConnector);
                ConnectionController.setConnectedSocialProvider(connectingProvider);
                WebviewController.setConnecting(false);
                ModalController.close();
              }
            } catch (e) {
              onClose();
              SnackController.showError('Something went wrong');
            }
          }}
        />
      </AnimatedSafeAreaView>
    </>
  ) : null;
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0
  },
  container: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
    borderTopLeftRadius: BorderRadius.l,
    borderTopRightRadius: BorderRadius.l,
    zIndex: 999
  },
  hidden: {
    display: 'none'
  },
  webview: {
    borderTopLeftRadius: BorderRadius.l,
    borderTopRightRadius: BorderRadius.l
  },
  closeButton: {
    alignSelf: 'flex-end',
    margin: Spacing.m
  }
});
