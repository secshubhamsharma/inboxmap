import { useCallback, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { fetchUserInfo } from '../lib/gmail'

export function useAuth() {
  const { setUser, setAccessToken, accessToken, signOut } = useApp()
  const tokenClientRef = useRef(null)

  const initGSI = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google GSI not loaded'))
        return
      }
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope:
          'https://www.googleapis.com/auth/gmail.readonly openid email profile',
        callback: async (response) => {
          if (response.error) {
            reject(new Error(response.error))
            return
          }
          try {
            const token = response.access_token
            setAccessToken(token)
            const userInfo = await fetchUserInfo(token)
            setUser(userInfo)
            resolve({ token, userInfo })
          } catch (err) {
            reject(err)
          }
        },
      })
      resolve(tokenClientRef.current)
    })
  }, [setAccessToken, setUser])

  const signIn = useCallback(async () => {
    const client = await initGSI()
    client.requestAccessToken()
  }, [initGSI])

  return { signIn, signOut, isAuthenticated: !!accessToken }
}
