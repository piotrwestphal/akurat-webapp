import ArchiveIcon from '@mui/icons-material/Archive'
import FavoriteIcon from '@mui/icons-material/Favorite'
import RestoreIcon from '@mui/icons-material/Restore'
import {BottomNavigation, BottomNavigationAction, Paper, Typography} from '@mui/material'
import {useState} from 'react'

export const Home = () => {
    const [value, setValue] = useState(0)

    return (
        <>
            <Typography variant="h5">It is working so far</Typography>
            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(_, newValue) => {
                        setValue(newValue)
                    }}>
                    <BottomNavigationAction label="Recents" icon={<RestoreIcon/>}/>
                    <BottomNavigationAction label="Favorites" icon={<FavoriteIcon/>}/>
                    <BottomNavigationAction label="Archive" icon={<ArchiveIcon/>}/>
                </BottomNavigation>
            </Paper>
        </>

    )
}