import { View, StyleSheet, Button, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamsList } from '../App'
import { WEBHOOKS_SERVER_URL } from '../config/constants'
import { useState } from 'react'

export type UserPayload = {
  name: string
  age: number
}

const WebHooksDemo = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList>>()

  const [name, setName] = useState<string>('')
  const [age, setAge] = useState<number>(0)

  const registerWithWebHook = async () => {
    try {
      const user = {
        name,
        age
      } as UserPayload

      const res = await fetch(WEBHOOKS_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      if (res.ok) {
        console.log('User registered successfully')
      } else {
        console.error('error from webhooks registration ', JSON.stringify(res))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <View style={styles.container}>
      <Button title='Go Back' onPress={() => navigation.goBack() } />
      <TextInput
        placeholder='Enter your name'
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        keyboardType='numeric'
        placeholder='Enter your age'
        value={age.toString()}
        onChangeText={text => setAge(text)}
        />
      <Button title='Register user' onPress={registerWithWebHook} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default WebHooksDemo