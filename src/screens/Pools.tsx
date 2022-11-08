import { VStack, Icon, useToast, FlatList } from 'native-base'
import { Octicons } from '@expo/vector-icons'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { api } from '../services/api'
import { useCallback, useEffect, useState } from 'react'
import { Loading } from '../components/Loading'
import { PoolCard, PoolPros } from '../components/PoolCard'
import { EmptyPoolList } from '../components/EmptyPoolList'

export function Pools() {
  const toast = useToast()

  const { navigate } = useNavigation()

  const [polls, setPolls] = useState<PoolPros[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      fetchPolls()
    }, []),
  )

  const fetchPolls = async () => {
    try {
      setIsLoading(true)

      const {
        data: { polls },
      } = await api.get('/polls')

      setPolls(polls)
    } catch (error) {
      console.log(error)
      toast.show({
        title: 'Erro ao buscar os bolões.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack
        mt={4}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        px={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={
            <Icon as={Octicons} name="search" color={'black'} size="md" />
          }
          onPress={() => navigate('Find')}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate('Details', { id: item.id })}
            />
          )}
          px={3}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  )
}
