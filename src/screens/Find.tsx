import { Heading, useToast, VStack } from 'native-base'
import { Header } from '../components/Header'

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useState } from 'react'
import { api } from '../services/api'
import { useNavigation } from '@react-navigation/native'

export function Find() {
  const { navigate } = useNavigation()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const handleJoinPoll = async () => {
    try {
      setIsLoading(true)

      if (!code.trim()) {
        setCode('')

        return toast.show({
          title: 'Informe o código do bolão corretamente.',
          placement: 'top',
          bgColor: 'red.500',
        })
      }

      await api.post(`/polls/join`, { code: code.toUpperCase() })

      toast.show({
        title: 'Bolão localizado.',
        placement: 'top',
        bgColor: 'green.500',
      })

      navigate('Pools')
    } catch (error) {
      setCode('')
      setIsLoading(false)

      if (error.response?.data?.message) {
        return toast.show({
          title: error.response?.data?.message,
          placement: 'top',
          bgColor: 'red.500',
        })
      }

      toast.show({
        title: 'Erro ao localizar bolão.',
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={1} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão ?"
          onChangeText={setCode}
          value={code}
          autoCapitalize="characters"
        />

        <Button
          title="BUSCAR BOLÃO"
          onPress={handleJoinPoll}
          isLoading={isLoading}
          _loading={{ _spinner: { color: 'white' } }}
        />
      </VStack>
    </VStack>
  )
}
