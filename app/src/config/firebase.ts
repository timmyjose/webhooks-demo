import messaging from '@react-native-firebase/messaging'
import { PermissionsAndroid, Platform } from 'react-native'

messaging().getToken().then(token => console.log('FCM Token: ', token)).catch(err => console.error(err))

const requestUserPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission()
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
  } else {
    const authStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
    return authStatus === 'granted'
  }

}

export { requestUserPermission}