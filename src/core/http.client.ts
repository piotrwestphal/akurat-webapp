import axios, {AxiosError, AxiosResponse, CanceledError, GenericAbortSignal, HttpStatusCode} from 'axios'
import {AuthContextParams} from '../ctx/AuthProvider'
import {ErrorResponse} from './types'

export type HttpResult<T = undefined> = Readonly<{
    data?: T
    errorMessage?: string
    errorStatus?: number
    errorDetails?: string
}>

export const RequestCancelledErrorMessage = 'CanceledError'

const authHost = `https://auth.${import.meta.env.VITE_HOSTNAME || window.location.hostname}`

export const httpGet = async <T>(url: string, signal?: GenericAbortSignal): Promise<HttpResult<T>> => call(axios.get<T>(url, {signal}))
export const httpAuthGetWithCreds = async <T>(url: string): Promise<HttpResult<T>> => call(axios.get<T>(`${authHost}${url}`, {withCredentials: true}))
export const httpPatch = async <T>(url: string, body: any): Promise<HttpResult<T>> => call(axios.patch<T>(url, body))
export const httpPost = async <T>(url: string, body: any): Promise<HttpResult<T>> => call(axios.post<T>(url, body))
export const httpAuthPost = async <T>(url: string, body: any): Promise<HttpResult<T>> => call(axios.post<T>(`${authHost}${url}`, body))
export const httpAuthPostWithCreds = async <T>(url: string, body: any): Promise<HttpResult<T>> => call(axios.post<T>(`${authHost}${url}`, body, {withCredentials: true}))
export const httpDelete = async <T>(url: string): Promise<HttpResult<T>> => call(axios.delete<T>(url))

const call = async <T>(req: Promise<AxiosResponse<T>>): Promise<HttpResult<T>> => {
    try {
        const result = await req
        return {
            data: result.data,
        }
    } catch (err) {
        const {response} = err as AxiosError<ErrorResponse>
        if (err instanceof CanceledError) {
            console.warn(`Request Cancelled`)
            return {
                errorMessage: RequestCancelledErrorMessage
            }
        }
        const {status, statusText, data} = response || {}
        console.error(`Error during fetching data [${status} ${statusText}]`)
        return {
            errorStatus: status,
            errorMessage: `${status} ${statusText}`,
            errorDetails: data?.message ? data.message : undefined,
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