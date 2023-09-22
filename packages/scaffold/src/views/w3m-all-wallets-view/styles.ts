import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  wallet: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    height: '65%'
  },
  contentContainer: {
    gap: 12,
    paddingBottom: 24,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 6 }
      }
    })
  }
});
