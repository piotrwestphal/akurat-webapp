import {Box, Typography} from '@mui/material'
import {useEffect} from 'react'
import {useSearchParams} from 'react-router-dom'
import {MultipleSelectInput} from '../common/MultipleSelectInput.tsx'
import { SelectInput } from '../common/SelectInput.tsx'

type ProfilesFiltersProps = Readonly<{}>
export const ProfilesFilters = ({}: ProfilesFiltersProps) => {

    // const [searchParams, setSearchParams] = useSearchParams()

    // useEffect(() => {
    //     setMac(searchParams.get('mac') || '')
    //     if (supportedAuditMsgTypes().includes(searchParams.get('type') as AuditMsgType)) {
    //         setType(searchParams.get('type') as AuditMsgType)
    //     } else {
    //         // in case if a parameter is manually entered in the URL
    //         searchParams.delete('type')
    //         setSearchParams(searchParams)
    //         setType(ALL)
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [searchParams])

    return (
        <>
            <Typography>Search by display name input</Typography>

            <Box sx={{
                display: 'flex',
                backgroundColor: 'white',
                zIndex: 1,
                mb: 1,
                top: 0,
                position: 'sticky',
                overflowX: 'scroll',
                scrollBehavior: 'smooth',
            }}>
                <SelectInput/>
                <MultipleSelectInput/>
                <MultipleSelectInput/>
                {['type', 'profile', 'hair color', 'height', 'has instagram', 'nick name'].map((v) =>
                    <Box key={v} sx={{
                        flexShrink: 0,
                    }} mt={1} mb={1} mr={1} ml={1} pl={1} pr={1}>{v}</Box>)}
            </Box>
        </>

    )
}