import {Box, Grid, ToggleButton, ToggleButtonGroup} from '@mui/material'
import {MouseEvent, useEffect, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {ProfileType} from '../../core/consts.ts'
import {httpGet, HttpResult} from '../../core/http.client.ts'
import {ProfileDto, ProfilesDto} from '../../core/types.ts'
import {composeQuery} from '../../core/utils.ts'
import {ErrorStatus, LoadingStatus, Status} from '../common/Status.tsx'
import {ProfileCard} from './ProfileCard.tsx'
import {ProfilesFilters} from './ProfilesFilters.tsx'

type FetchResultState = HttpResult<ProfilesDto> & Readonly<{ loading: boolean }>

// TODO: infinite scroll - https://www.npmjs.com/package/react-infinite-scroller
export const Profiles = () => {
    const [fetchResult, setFetchResult] = useState<FetchResultState>({loading: false})
    const [profiles, setProfiles] = useState<ProfileDto[]>([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [profileType, setProfileType] = useState<ProfileType | null>(null)

    // useEffect(() => {
    //     const abortController = new AbortController()
    //     setFetchResult({loading: true})
    //     // const filters = {
    //     //     [macQueryKey]: searchParams.get(macQueryKey),
    //     //     [typeQueryKey]: searchParams.get(typeQueryKey),
    //     //     [dayQueryKey]: searchParams.get(dayQueryKey),
    //     // }
    //     // const pagination = {
    //     //     [offsetQueryKey]: String(parseInt(searchParams.get(pageParamKey)!) * parseInt(searchParams.get(rowsPerPageParamKey)!)),
    //     //     [limitQueryKey]: searchParams.get(rowsPerPageParamKey)!
    //     // }
    //     const query = composeQuery({})
    //     httpGet<any>(`/api/v1/profiles${query}`, abortController.signal)
    //         .then(({data, errorMessage}) => {
    //             if (errorMessage !== RequestCancelledErrorMessage) {
    //                 setFetchResult({loading: false, data, errorMessage})
    //             }
    //         })
    //
    //     return () => abortController.abort()
    // }, [])

    useEffect(() => {
        refresh()
    }, [])

    useEffect(() => {
        if (fetchResult.data) {
            setProfiles(fetchResult.data?.items)
        }
    }, [fetchResult.data])


    useEffect(() => {
        const filters = Object.fromEntries(Array.from(searchParams.entries()))
        refresh(filters)
    }, [searchParams])
    const refresh = (filters: Record<string, string> = {}) => {
        const query = composeQuery({limit: '250', ...filters})
        const abortController = new AbortController()
        setFetchResult({loading: true})
        httpGet<ProfilesDto>(`/api/v1/profiles${query}`, abortController.signal)
            .then(({data, errorMessage}) => {
                setFetchResult({loading: false, data, errorMessage})
            })
        return () => abortController.abort()
    }

    const onChange = (_: MouseEvent<HTMLElement>, newValue: ProfileType | null) => {
        setProfileType(newValue)
        if (newValue) {
            searchParams.set('type', newValue)
        } else {
            searchParams.delete('type')
        }
        setSearchParams(searchParams)
    }

    return (
        <Box>
            <ToggleButtonGroup sx={{m: 1}}
                               value={profileType}
                               exclusive
                               onChange={onChange}>
                <ToggleButton value={ProfileType.MODEL}
                              color="primary"
                              size="small">{ProfileType.MODEL}</ToggleButton>
                <ToggleButton value={ProfileType.PHOTO}
                              size="small">{ProfileType.PHOTO}</ToggleButton>
                <ToggleButton value={ProfileType.BRAND}
                              size="small">{ProfileType.BRAND}</ToggleButton>
            </ToggleButtonGroup>
            {fetchResult.loading && <LoadingStatus/>}
            {fetchResult.data &&
                <>
                    <ProfilesFilters/>
                    <Grid pb={3} container>
                        {profiles.map(dto =>
                            <Grid item key={dto.id}
                                  xs={12} sm={6} md={4} lg={3} xl={2}>
                                <ProfileCard dto={dto}/>
                            </Grid>)}
                    </Grid>
                </>
            }
            {fetchResult.data?.items.length === 0 && <Status label="No results"/>}
            {fetchResult.errorMessage && <ErrorStatus label={fetchResult.errorMessage}/>}
        </Box>
    )
}