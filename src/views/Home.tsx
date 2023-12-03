import FavoriteIcon from '@mui/icons-material/Favorite'
import RestoreIcon from '@mui/icons-material/Restore'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import {BottomNavigation, BottomNavigationAction, CssBaseline, Paper} from '@mui/material'
import Box from '@mui/material/Box'
import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {profileRoute} from '../core/routes.ts'
import {Profiles} from './profile/Profiles.tsx'

export const Home = () => {
    const navigate = useNavigate()
    const [value, setValue] = useState(0)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
    }, [value]);

    return (
        <Box pb={7} ref={ref}>
            <CssBaseline />
            <Profiles/>
            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, mb: 3}} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(_, newValue) => {
                        setValue(newValue)
                    }}>
                    <BottomNavigationAction disabled label="Recents" icon={<RestoreIcon/>}/>
                    <BottomNavigationAction disabled label="Favorites" icon={<FavoriteIcon/>}/>
                    <BottomNavigationAction onClick={() => navigate(profileRoute)} label="Profile" icon={<AccountCircleIcon/>}/>
                </BottomNavigation>
            </Paper>
        </Box>
    )
}