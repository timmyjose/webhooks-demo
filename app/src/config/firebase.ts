import messaging from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'

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