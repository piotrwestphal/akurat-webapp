import {Button, ButtonProps} from '@mui/material'

export const ImageButton = ({
                                children,
                                ...props
                            }: ButtonProps) =>
    <Button sx={{m: 1, width: 100, textAlign: 'center', textTransform: 'none', font: 'caption', fontSize: 'small'}}
            size="medium"
            color="secondary"
            variant="outlined"
            {...props}>{children}</Button>