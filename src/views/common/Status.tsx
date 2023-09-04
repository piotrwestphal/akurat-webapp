import Box from '@mui/material/Box'
import { SxProps } from '@mui/system'
import { Theme } from '@mui/material/styles'
import { Typography } from '@mui/material'

const statusStyle = {
    m: 2,
} satisfies SxProps<Theme>

type StatusProps = Readonly<{
    label: string
}>

export const Status = ({label}: StatusProps) => <Typography sx={statusStyle}>{label}</Typography>

export const LoadingStatus = () => <Box className="dots-3"></Box>

export const ErrorStatus = ({label}: StatusProps) =>
    <Typography fontSize={14} color="error" sx={statusStyle}>{label}</Typography>

export const SuccessStatus = ({label}: StatusProps) =>
    <Typography fontSize={14} color="green" sx={statusStyle}>{label}</Typography>