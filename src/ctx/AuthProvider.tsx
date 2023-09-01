import {AxiosError} from 'axios'
import {createContext, ReactNode, useContext, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {httpGet} from '../core/http.client.ts'
import {loginRoute, welcomeRoute} from '../core/routes'
import {AuthRes} from '../core/types'
import {useLocalStorage, userKey} from '../core/useLocalStorage'

type LoginParams = AuthRes & Pick<AuthContextParams, 'userEmail'>

export type AuthContextParams = Readonly<{
    token: string
    userEmail: string
    login: (res: LoginParams, callback?: VoidFunction) => void
    logout: () => Promise<void>
    refreshOnCall: (onSuccess: () => Promise<AxiosError>, onError: () => Promise<AxiosError>) => Promise<AxiosError>
    refreshOnReload: (callbacks: { onSuccess?: VoidFunction, onError?: VoidFunction }) => Promise<void>
}>

const AuthContext = createContext<AuthContextParams>(null!)

type AuthState = Readonly<{
    token: string
}>

const initialAuthState = {
    token: '',
} satisfies AuthState

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const navigate = useNavigate()
    const [user, setUser] = useLocalStorage<string>(userKey, '')
    const [authState, setAuthState] = useState<AuthState>(initialAuthState)

    const login = ({token, userEmail}: LoginParams,
                   callback?: VoidFunction) => {
        setUser(userEmail)
        setAuthState({token})
        callback?.()
    }

    const logout = async () => {
        await httpGet<{ message: string }>('/api/v1/auth/logout')
        setAuthState(initialAuthState)
        navigate(welcomeRoute, {state: {noRefresh: true}})
    }

    const refreshOnReload: AuthContextParams['refreshOnReload'] = async ({
                                                                             onSuccess,
                                                                             onError,
                                                                         }) => {
        const {data} = await httpGet<AuthRes>('/api/v1/auth/refresh')
        if (data) {
            setAuthState({token: data.token})
            onSuccess?.()
        } else {
            setAuthState(initialAuthState)
            onError?.()
        }
    }

    const refreshOnCall = async (onSuccess: () => Promise<AxiosError>,
                                 onError: () => Promise<AxiosError>): Promise<AxiosError> => {
        const {data} = await httpGet<AuthRes>('/api/v1/auth/refresh')
        if (data) {
            setAuthState({token: data.token})
            return onSuccess()
        } else {
            setAuthState(initialAuthState)
            navigate(loginRoute, {state: {noRefresh: true}, replace: true})
            return onError()
        }
    }
    const value = useMemo(() => {
            return {
                token: authState.token,
                userEmail: user,
                login,
                logout,
                refreshOnReload,
                refreshOnCall,
            } satisfies AuthContextParams
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [authState.token, user])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)