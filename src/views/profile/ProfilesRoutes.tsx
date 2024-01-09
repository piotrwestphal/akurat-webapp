import {Typography} from '@mui/material'
import {useEffect, useState} from 'react'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {profileRoute} from '../../core/routes.ts'
import {useAuth} from '../../ctx/AuthProvider'
import {LoadingStatus} from '../common/Status.tsx'

export const ProfilesRoutes = () => {
    const {token, refreshOnReload} = useAuth()
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const noRefresh = !!location.state?.noRefresh

    useEffect(() => {
        console.log('PROFILES ROUTESS')
    }, [])

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
            <Typography variant="h4">Profiles</Typography>
            {loading && <LoadingStatus/>}
            {!loading && <Outlet/>}
        </>
    )
}