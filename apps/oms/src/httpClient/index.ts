import useAuth, { getAuth } from '@/composables/useAuth'
import axios from 'axios'
import { stringify } from 'qs'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  paramsSerializer: (params) => {
    return stringify(params, {
      encodeValuesOnly: true
    })
  }
})

type RequestParams = Parameters<typeof httpClient.interceptors.request.use>
type ResponseParams = Parameters<typeof httpClient.interceptors.response.use>

// ================================== Interceptors Request ==================================
const requestFulfilled: RequestParams[0] = async (config) => {
  const { getCurrentUserInfo } = getAuth()
  const currentUserInfo = getCurrentUserInfo()
  if (currentUserInfo) {
    config.headers.Authorization = `Bearer ${currentUserInfo.accessToken}`
  }

  return config
}

const requestError: RequestParams[1] = async (error) => {
  return Promise.reject(error)
}

// ================================== Interceptors Response ==================================
const responseFulfilled: ResponseParams[0] = (config) => {
  return config
}
const responseError: ResponseParams[1] = async (error) => {
  return Promise.reject(error)
}

httpClient.interceptors.request.use(requestFulfilled, requestError)
httpClient.interceptors.response.use(responseFulfilled, responseError)

export default httpClient
