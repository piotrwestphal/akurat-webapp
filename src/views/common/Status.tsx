import {Stack, Typography} from '@mui/material'
import Box from '@mui/material/Box'
import {Theme} from '@mui/material/styles'
import {SxProps} from '@mui/system'

const statusStyle = {
    m: 2,
} satisfies SxProps<Theme>

type StatusProps = Readonly<{
    label: string
}>

export const Status = ({label}: StatusProps) => <Typography sx={statusStyle}>{label}</Typography>

export const LoadingStatus = () => <Stack sx={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}} alignItems="center"><Box className="dots-3"></Box></Stack>

export const ErrorStatus = ({label}: StatusProps) =>
    <Typography color="error"
                align="center"
                fontSize={14}
                sx={statusStyle}>{label}</Typography>

export const SuccessStatus = ({label}: StatusProps) =>
    <Typography color="green"
                fontSize={14}
                sx={statusStyle}>{label}</Typography>