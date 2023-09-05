import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import Fab from '@mui/material/Fab'
import {Theme} from '@mui/material/styles'
import {SxProps} from '@mui/system'

const fabButtonStyle = {
    m: 2,
    position: 'fixed',
} satisfies SxProps<Theme>

type FabButtonProps = Readonly<{
    onClick: () => void
    disabled: boolean
}>

type FabSubmitButtonProps = Readonly<{
    disabled: boolean
}>

export const FabSubmitButton = ({disabled}: FabSubmitButtonProps) =>
    <Fab type="submit"
         sx={{...fabButtonStyle, bottom: 32, right: 16}}
         disabled={disabled}
         color="primary">
        <CheckIcon/>
    </Fab>

export const FabAddButton = ({onClick, disabled}: FabButtonProps) =>
    <Fab onClick={onClick}
         sx={{...fabButtonStyle, bottom: 32, right: 16}}
         disabled={disabled}
         color="primary">
        <AddIcon/>
    </Fab>


export const FabResetButton = ({onClick, disabled}: FabButtonProps) =>
    <Fab onClick={onClick}
         sx={{...fabButtonStyle, bottom: 40, right: 88}}
         disabled={disabled}
         size="small"
         color="secondary">
        <ClearIcon/>
    </Fab>

export const FabBackButton = ({onClick, disabled}: FabButtonProps) =>
    <Fab onClick={onClick}
         sx={{...fabButtonStyle, bottom: 40, left: 20}}
         disabled={disabled}
         size="small"
         color="secondary">
        <ArrowBackIcon/>
    </Fab>