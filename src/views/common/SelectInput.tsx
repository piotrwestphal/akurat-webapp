import ClearIcon from '@mui/icons-material/Clear'
import {FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material'
import {useState} from 'react'
import {ProfileType} from '../../core/consts.ts'

const ALL = {name: 'ALL', value: ''}

type SelectInputProps = Readonly<{
    label?: string
    loading?: boolean
}>

export const SelectInput = ({
                                label = 'Filter by type',
                                loading = false,
                            }: SelectInputProps) => {
    const [value, setValue] = useState<string>(ALL.value)

    const onChange = (ev: SelectChangeEvent<string>) => {
        setValue(ev.target.value)
    }

    return (
        <FormControl variant="outlined"
                     size="small"
                     sx={{m: 1, width: 130, flexShrink: 0}}>
            <InputLabel>{label}</InputLabel>
            <Select id="demo-checkbox"
                    value={value}
                    color="secondary"
                    sx={{p: 0, borderRadius: 20}}
                    SelectDisplayProps={{
                        style: {
                            paddingLeft: 16,
                            paddingRight: 16,
                        },
                    }}
                    label={label}
                    onChange={onChange}
                    disabled={loading}
                    size="small"
                    IconComponent={() => null}
                    endAdornment={!!value
                        ? <IconButton onClick={() => setValue(ALL.value)}><ClearIcon/></IconButton>
                        : undefined}>
                <MenuItem key={ALL.name} value={ALL.value}>{ALL.name}</MenuItem>
                {...Object.values(ProfileType).map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
        </FormControl>
    )
}