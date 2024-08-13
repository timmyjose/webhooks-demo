import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './screens/Home'
import WebHooksDemo from './screens/WebHooksDemo'
import { useEffect } from 'react'
import { requestUserPermission } from './config/firebase'
import messaging from '@react-native-firebase/messaging'
import { Alert } from 'react-native'

export type RootStackParamsList = {
  Home: undefined
  WebHooksDemo: undefined
}

const Stack = createNativeStackNavigator<RootStackParamsList>()

export function App() {
  // set up push notifications
  useEffect(() => {
    requestUserPermission()
  }, [])

  useEffect(() => {
    // foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(JSON.stringify(remoteMessage))
    })

    return unsubscribe
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='WebHooksDemo' component={WebHooksDemo} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App