import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import HomeIcon from '@mui/icons-material/Home'
import SearchIcon from '@mui/icons-material/Search'
import MessageIcon from '@mui/icons-material/Message'
import {BottomNavigation, BottomNavigationAction, CssBaseline, Paper} from '@mui/material'
import Box from '@mui/material/Box'
import {useEffect, useRef, useState} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import {homeRoute, profileRoute, profilesRoute} from '../core/routes.ts'

export const Base = () => {
    const navigate = useNavigate()
    const [value, setValue] = useState(0)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0
    }, [value])

    return (
        <Box pb={7} ref={ref}>
            <CssBaseline/>
            <Outlet/>
            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, pb: 3}} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(_, newValue) => setValue(newValue)}>
                    <BottomNavigationAction label="Search"
                                            icon={<SearchIcon/>}
                                            onClick={() => navigate(profilesRoute, {state: {from: homeRoute}})}/>
                    <BottomNavigationAction disabled
                                            label="Messages"
                                            icon={<MessageIcon/>}/>
                    <BottomNavigationAction disabled
                                            label="Home"
                                            icon={<HomeIcon/>}/>
                    <BottomNavigationAction label="Profile"
                                            icon={<AccountCircleIcon/>}
                                            onClick={() => navigate(profileRoute, {state: {from: homeRoute}})}/>
                </BottomNavigation>
            </Paper>
        </Box>
    )
}