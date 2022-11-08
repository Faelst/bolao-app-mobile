import { Box, FlatList, useToast } from 'native-base'
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { EmptyMyPoolList } from './EmptyMyPoolList'
import { Game, GameProps } from './Game'
import { Loading } from './Loading'

interface Props {
  poolId: string
  code: string
}

export function Guesses({ poolId, code }: Props) {
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')

  const fetchGame = async () => {
    try {
      setIsLoading(true)
      const { data } = await api.get(`/polls/${poolId}/games`)

      setGames(data.games)
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Erro ao carregar jogo.',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuessConfirm = async (gameId: string) => {
    try {
      setIsLoading(true)

      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o palpite corretamente',
          placement: 'top',
          bgColor: 'red.500',
        })
      }

      await api.post(`/polls/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })

      toast.show({
        title: 'Palpite enviado.',
        placement: 'top',
        bgColor: 'green.500',
      })

      fetchGame()
    } catch (error) {
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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGame()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  )
}
