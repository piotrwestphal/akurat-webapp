import {useEffect, useState} from 'react'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {profileRoute} from '../core/routes'
import {useAuth} from './../ctx/AuthProvider'
import {LoadingStatus} from './common/Status'

export const PublicRoutes = () => {
    const {token, refreshOnReload} = useAuth()
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const noRefresh = !!location.state?.noRefresh

    useEffect(() => {
        if (noRefresh) {
            return
        }
        if (!token) {
            setLoading(true)
            refreshOnReload({
                onSuccess: () => navigate(profileRoute),
            }).finally(() => setLoading(false))
        }
    }, [token, noRefresh, refreshOnReload, navigate])
    return (
        <>
            {loading && <LoadingStatus/>}
            {!loading && <Outlet/>}
        </>
    )
}