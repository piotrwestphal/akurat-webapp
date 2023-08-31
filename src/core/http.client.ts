import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios'
import { AuthContextParams } from '../ctx/AuthProvider'
import { ErrorResponse } from './types'

const apiUrl = import.meta.env.VITE_API_URL || ''

export type HttpResult<T = undefined> = Readonly<{
    data?: T
    errorMessage?: string
    errorStatus?: number
    errorDetails?: string
}>

export const httpGet = async <T>(url: string): Promise<HttpResult<T>> => call(axios.get<T>(`${apiUrl}${url}`))
export const httpPatch = async <T>(url: string, body: any): Promise<HttpResult<T>> => call(axios.patch<T>(`${apiUrl}${url}`, body))
export const httpPost = async <T>(url: string, body: any): Promise<HttpResult<T>> => call(axios.post<T>(`${apiUrl}${url}`, body))
export const httpDelete = async <T>(url: string): Promise<HttpResult<T>> => call(axios.delete<T>(`${apiUrl}${url}`))

const call = async <T>(req: Promise<AxiosResponse<T>>): Promise<HttpResult<T>> => {
    try {
        const result = await req
        return {
            data: result.data
        }
    } catch (err) {
        const {response} = err as AxiosError<ErrorResponse>
        console.error(`Error during fetching data [${response?.status} ${response?.statusText}]`)
        const {status, statusText, data} = response!
        return {
            errorStatus: status,
            errorMessage: `${status} ${statusText}`,
            errorDetails: data.message ? data.message : undefined,
        }
    }
}

export const registerInterceptors = ({
                                         token,
                                         refreshOnCall,
                                     }: AuthContextParams) => {
    axios.interceptors.request.clear()
    axios.interceptors.response.clear()
    axios.interceptors.request.use(
        (res) => {
            if (token) {
                res.headers.set('Authorization', `Bearer ${token}`)
            }
            return res
        })
    axios.interceptors.response.use(
        (res) => res,
        async (originErr: AxiosError): Promise<AxiosError> => {
            const originCall = originErr.config!
            if (token && originErr.response?.status === HttpStatusCode.Unauthorized) {
                return refreshOnCall(() => axios(originCall), () => Promise.reject(originErr))
            }
            return Promise.reject(originErr)
        })
}