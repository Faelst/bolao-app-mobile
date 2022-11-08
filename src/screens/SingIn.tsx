import { Center, Icon, Text } from 'native-base'
import { Fontisto } from '@expo/vector-icons'
import Logo from '../assets/logo.svg'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

export function SignIn() {
  const { signIn, isUserLoading } = useAuth()

  return (
    <Center flex={1} bgColor="gray.900" padding={7}>
      <Logo width={212} height={40} />
      <Button
        title="ENTRE COM GOOGLE"
        type="SECONDARY"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        mt={12}
        px={10}
        onPress={signIn}
        isLoading={isUserLoading}
        _loading={{ _spinner: { color: 'white' } }}
      />

      <Text color="gray.400" textAlign="center" marginTop={5}>
        Não utilizamos nenhuma informação além {'\n'} do seu email para criação
        de sua conta.
      </Text>
    </Center>
  )
}
