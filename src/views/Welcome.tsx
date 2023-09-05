import Diversity2TwoToneIcon from '@mui/icons-material/Diversity2TwoTone'
import {Button, Stack, Typography} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {loginRoute, signUpRoute} from '../core/routes'

export const Welcome = () => {
    const navigate = useNavigate()

    return (
        <Stack height="100vh"
               direction="column"
               alignItems="center"
               justifyContent="center"
               spacing={3}>
            <Diversity2TwoToneIcon color="primary" fontSize="large"/>
            <Typography variant="h6">Welcome to Kolektiv!</Typography>
            <Stack direction="row"
                   spacing={2}>
                <Button onClick={() => navigate(loginRoute, {state: {noRefresh: true}})}
                        variant="contained"
                        size="medium">Log in</Button>
                <Button onClick={() => navigate(signUpRoute, {state: {noRefresh: true}})}
                        variant="outlined"
                        size="medium">Sign up</Button>
            </Stack>
        </Stack>
    )
}