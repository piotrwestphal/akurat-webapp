import ClearIcon from '@mui/icons-material/Clear'
import {IconButton, MenuItem, Select, SelectChangeEvent, useMediaQuery, useTheme} from '@mui/material'
import {useState} from 'react'

const ALL = 'Select type'

type SelectInputProps = Readonly<{
    loading?: boolean
}>

export const MultipleSelectInput = ({
                                loading = false,
                            }: SelectInputProps) => {
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    const [value, setValue] = useState<string[]>([])

    const onChange = (ev: SelectChangeEvent<string[]>) => {
        setValue(ev.target.value as string[])
    }

    const onClear = () => {
        console.log('CLEAR')
        setValue([])
    }

    // InputProps={{
    //     notched: false,
    //     style: {borderRadius: 20, padding: 0},

    return (
        <Select value={value}
                color="secondary"
                sx={{ml: 1, maxWidth: 400, flexShrink: 0, p: 0, borderRadius: 20}}
            // autoWidth
                multiple
                SelectDisplayProps={{
                    style: {
                        paddingLeft: 16,
                        paddingRight: 16,
                    },
                }}
                onChange={onChange}
                disabled={loading}
                size="small"
                variant="outlined"
                placeholder="Select and press enter"
                IconComponent={() => null}
                endAdornment={value.length !== 0 ? <IconButton onClick={onClear}><ClearIcon/></IconButton> : undefined}>
            <MenuItem key={ALL} value={ALL}>{ALL}</MenuItem>
            {...['type'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
        </Select>
    )
}