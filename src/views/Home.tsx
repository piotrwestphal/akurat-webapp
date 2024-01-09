import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import {BottomNavigation, BottomNavigationAction, CssBaseline, Paper} from '@mui/material'
import Box from '@mui/material/Box'
import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {homeRoute, profileRoute, profilesRoute} from '../core/routes.ts'
import {Profiles} from './profile/Profiles.tsx'

export const Home = () => {
    const navigate = useNavigate()
    const [value, setValue] = useState(0)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0
    }, [value])

    return (
        <Box pb={7} ref={ref}>
            <CssBaseline/>
            <Profiles/>
            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, pb: 3}} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(_, newValue) => {
                        setValue(newValue)
                    }}>
                    <BottomNavigationAction onClick={() => navigate(profilesRoute, {state: {from: homeRoute}})} label="Search" icon={<SearchIcon/>}/>
                    <BottomNavigationAction disabled label="Home" icon={<HomeIcon/>}/>
                    <BottomNavigationAction onClick={() => navigate(profileRoute, {state: {from: homeRoute}})}
                                            label="Profile" icon={<AccountCircleIcon/>}/>
                </BottomNavigation>
            </Paper>
        </Box>
    )
}