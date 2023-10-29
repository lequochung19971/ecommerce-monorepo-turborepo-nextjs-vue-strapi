import httpClient from '@/httpClient'
import type { AppRoute } from '@/router'
import { ApiUrl } from 'types'
import { useRouter } from 'vue-router'
import { googleTokenLogin } from 'vue3-google-login'
type UserLoginResponse = {
  jwt: string
  user: {
    id: string
    username: string
    email: string
  }
}

export type UserInfo = {
  accessToken: string
  id: string
  username: string
  email: string
}

enum LocalStorageKey {
  USER_INFO = 'userInfo',
  CALLBACK_URL = 'callbackUrl'
}

const useAuth = () => {
  const router = useRouter()
  const storeUserInfo = (userInfo: UserInfo) => {
    localStorage.setItem(LocalStorageKey.USER_INFO, JSON.stringify(userInfo))
  }

  const getCallbackUrl = () => {
    return localStorage.getItem(LocalStorageKey.CALLBACK_URL) ?? ('/dashboard' as AppRoute)
  }

  const googleSignIn = async () => {
    const response = await googleTokenLogin()
    const { data } = await httpClient.get<UserLoginResponse>(
      `${ApiUrl.AUTH_GOOGLE_CALLBACK}?access_token=${response.access_token}`
    )
    const currentUserInfo: UserInfo = {
      accessToken: data.jwt,
      id: data.user.id,
      username: data.user.username,
      email: data.user.email
    }
    storeUserInfo(currentUserInfo)
    router.push(getCallbackUrl())
    localStorage.removeItem(LocalStorageKey.CALLBACK_URL)
    return currentUserInfo
  }

  const emailSignIn = async (credentials: { email: string; password: string }) => {
    const { data } = await httpClient.post<UserLoginResponse>(ApiUrl.AUTH_LOCAL, {
      identifier: credentials?.email,
      password: credentials?.password
    })
    const currentUserInfo: UserInfo = {
      id: data.user.id,
      email: data.user.email,
      username: data.user.username,
      accessToken: data.jwt
    }
    storeUserInfo(currentUserInfo)
    router.push(getCallbackUrl())
    localStorage.removeItem(LocalStorageKey.CALLBACK_URL)

    return data
  }

  const getCurrentUserInfo = () => {
    const userInfo = localStorage.getItem(LocalStorageKey.USER_INFO)
    if (!userInfo) return null

    return JSON.parse(userInfo) as UserInfo
  }

  const logout = (option?: { callbackUrl: AppRoute }) => {
    localStorage.setItem(
      LocalStorageKey.CALLBACK_URL,
      option?.callbackUrl || router.currentRoute.value.path
    )
    localStorage.removeItem(LocalStorageKey.USER_INFO)
    router.push('/auth/sign-in' as AppRoute)
  }

  return {
    emailSignIn,
    googleSignIn,
    getCurrentUserInfo,
    logout
  }
}

export const getAuth = () => {
  return {
    getCurrentUserInfo: () => {
      const userInfo = localStorage.getItem(LocalStorageKey.USER_INFO)
      if (!userInfo) return null

      return JSON.parse(userInfo) as UserInfo
    }
  }
}

export default useAuth
