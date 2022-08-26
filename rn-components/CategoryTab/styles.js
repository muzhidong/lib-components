import { StyleSheet } from 'react-native';
import appStyles from 'app/styles/appStyles';

export default StyleSheet.create({
  tabContainer: {
    position: 'relative',
    width: '100%',
    height: 72.5,
    paddingTop: 22.5,
    paddingHorizontal: 15,
    backgroundColor: '#00A0B5'
  },
  shadow: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 11,
    height: 36,
    zIndex: 0
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  text: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14
  },
  space: {
    marginRight: 25
  },
  active: {
    paddingBottom: 5,
    fontWeight: 'bold',
    fontSize: appStyles.color.big
  },
  underline: {
    width: 32.5,
    height: 3.5,
    paddingTop: 5,
    textAlign: 'center',
    borderRadius: 3
  }
});
