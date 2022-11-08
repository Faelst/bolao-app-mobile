import { Heading, Text, Toast, useToast, VStack } from 'native-base'
import { Header } from '../components/Header'

import Logo from '../assets/logo.svg'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useState } from 'react'
import { api } from '../services/api'

export function New() {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handlePoolCreate = async () => {
    if (!title.trim()) {
      return toast.show({
        title: 'Informe o titulo do bolão corretamente.',
        placement: 'top',
        bgColor: 'red.500',
      })
    }

    try {
      setIsLoading(true)
      const poll = await api.post('/polls', {
        title,
      })

      console.log(poll)

      toast.show({
        title: 'Bolão criado !',
        placement: 'top',
        bgColor: 'green.500',
      })
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Não foi possível criar o bolão.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
      setTitle('')
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o nome do seu bolão ?"
          value={title}
          onChangeText={setTitle}
        />

        <Button
          title="CRIAR MEU BOLÃO"
          onPress={handlePoolCreate}
          isLoading={isLoading}
        />

        <Text color="gray.200" fontSize="sm" textAlign={'center'} mt={5} px={1}>
          {' '}
          Após criar seu bolão, você recebera um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  )
}
