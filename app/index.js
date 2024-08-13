import { registerRootComponent } from 'expo'
import App from './src/App'
import messaging from '@react-native-firebase/messaging'

// register background handler for push notifications
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(`Message handled in the background: ${remoteMessage}`)
})

registerRootComponent(App)