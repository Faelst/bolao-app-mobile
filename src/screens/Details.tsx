import { useRoute } from '@react-navigation/native'
import { HStack, useToast, VStack } from 'native-base'
import { useEffect, useState } from 'react'
import { Share } from 'react-native'
import { EmptyMyPoolList } from '../components/EmptyMyPoolList'
import { Guesses } from '../components/Guesses'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { Option } from '../components/Option'
import { PoolPros } from '../components/PoolCard'
import { PoolHeader } from '../components/PoolHeader'
import { api } from '../services/api'

interface RouterParams {
  id: string
}

export function Details() {
  const toast = useToast()

  const { id } = useRoute().params as RouterParams
  const [isLoading, setIsLoading] = useState(true)
  const [pollDetails, setPollDetails] = useState<PoolPros>({} as PoolPros)
  const [optionSelected, setOptionSelected] = useState<'RANKING' | 'GUESSES'>(
    'GUESSES',
  )

  const fetchPollDetails = async () => {
    try {
      const {
        data: { poll },
      } = await api.get(`/polls/${id}`)

      setPollDetails(poll)
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Erro ao carregar bolão.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeShare = async () => {
    await Share.share({
      message: pollDetails.code,
    })
  }

  useEffect(() => {
    fetchPollDetails()
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pollDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {pollDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={pollDetails}></PoolHeader>
          <HStack bg="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'GUESSES'}
              onPress={() => setOptionSelected('GUESSES')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'RANKING'}
              onPress={() => setOptionSelected('RANKING')}
            />
          </HStack>

          <Guesses poolId={pollDetails.id} code={pollDetails.code} />
        </VStack>
      ) : (
        <VStack>
          <EmptyMyPoolList code={pollDetails.code} />
        </VStack>
      )}
    </VStack>
  )
}
