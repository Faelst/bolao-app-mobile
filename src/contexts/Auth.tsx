import { createContext, ReactNode, useEffect, useState } from 'react'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { api } from '../services/api'

WebBrowser.maybeCompleteAuthSession()

interface UserProps {
  sub: string
  name: string
  avatarUrl: string
}

export interface AuthContextDataProps {
  user: UserProps
  signIn: () => Promise<void>
  isUserLoading: boolean
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthProviderProps) {
  const { GOOGLE_CLIENT_ID } = process.env
  const [user, setUser] = useState<UserProps>({} as UserProps)
  const [isUserLoading, setIsUserLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  })

  const signIn = async () => {
    try {
      setIsUserLoading(true)
      await promptAsync()
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  const signInWithGoogle = async (accessToken: string) => {
    try {
      setIsUserLoading(true)
      const {
        data: { token: googleToken },
      } = await api.post('/users', { accessToken })

      api.defaults.headers.common['Authorization'] = `Bearer ${googleToken}`

      const { data: userInfo } = await api.get('/me')

      setUser(userInfo.user)
    } catch (error) {
      console.log(error)
    } finally {
      setIsUserLoading(false)
    }
  }

  useEffect(() => {
    if (response?.type === 'success') {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])

  return (
    <AuthContext.Provider
      value={{
        isUserLoading,
        signIn,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
