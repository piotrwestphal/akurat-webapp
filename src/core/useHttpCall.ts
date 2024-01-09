import { useEffect, useState } from 'react'
import {httpGet, HttpResult} from './http.client.ts'

type ResultState<T = unknown> = Readonly<{
    loading: boolean
}> & HttpResult<T>

const initial = {
    loading: false,
} satisfies ResultState


export const useHttpGet = <T = unknown>(url: string) => {
    const [result, setResult] = useState<ResultState>(initial)
    useEffect(() => {
        setResult({...initial, loading: true})
        const invoke = async (url: string) => {
            const result = await httpGet<T>(url)
            setResult({...initial, ...result})
        }
        invoke(url)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])

    return result as ResultState<T>
}