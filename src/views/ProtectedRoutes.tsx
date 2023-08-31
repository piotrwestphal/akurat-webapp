import {useEffect, useState} from 'react'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {loginRoute} from '../core/routes'
import {useAuth} from './../ctx/AuthProvider'
import {LoadingStatus} from './common/Status'

export const ProtectedRoutes = () => {
    const {token, refreshOnReload} = useAuth()
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            setLoading(true)
            refreshOnReload({
                onError: () => navigate(loginRoute, {state: {noRefresh: true, from: location}, replace: true}),
            }).finally(() => setLoading(false))
        }
    }, [token, refreshOnReload, navigate, location])
    return (
        <>
            {loading && <LoadingStatus/>}
            {!loading && <Outlet/>}
        </>
    )
}