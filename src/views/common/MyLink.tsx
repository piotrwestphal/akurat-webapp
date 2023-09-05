import {Link, SxProps, useTheme} from '@mui/material'
import {Theme} from '@mui/material/styles'

type MyLinkProps = Readonly<{
    to: string
    state: any
    children: string
}>

const sx = (theme: Theme) => ({
    ':hover': {
        color: theme.palette.secondary.light,
    },
} satisfies SxProps<Theme>)

export const MyLink = ({
                           to,
                           children,
                           state,
                       }: MyLinkProps) => {
    const theme = useTheme()
    return <Link sx={sx(theme)} href={to} {...{state}}>{children}</Link>
}

