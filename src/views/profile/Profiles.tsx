import {Box, Grid} from '@mui/material'
import {useEffect, useState} from 'react'
import {httpGet, HttpResult} from '../../core/http.client.ts'
import {ProfileDto, ProfilesDto} from '../../core/types.ts'
import {ErrorStatus, LoadingStatus, Status} from '../common/Status.tsx'
import {ProfileCard} from './ProfileCard.tsx'

type FetchResultState = HttpResult<ProfilesDto> & Readonly<{ loading: boolean }>

export const Profiles = () => {
    const [fetchResult, setFetchResult] = useState<FetchResultState>({loading: false})
    const [profiles, setProfiles] = useState<ProfileDto[]>([])

    useEffect(() => {
        refresh()
    }, [])

    useEffect(() => {
        if (fetchResult.data) {
            setProfiles(fetchResult.data?.items)
        }
    }, [fetchResult.data])

    const refresh = () => {
        setFetchResult({loading: true})
        httpGet<ProfilesDto>(`/api/v1/profiles?limit=250`)
            .then(({data, errorMessage}) => {
                setFetchResult({loading: false, data, errorMessage})
            })
    }

    return (
        <Box>
            {fetchResult.loading && <LoadingStatus/>}
            {fetchResult.data &&
                <Grid pb={3} container>
                    {profiles.map(dto =>
                        <Grid item key={dto.id}
                              xs={12} sm={6} md={4} lg={3} xl={2}>
                            <ProfileCard dto={dto}/>
                        </Grid>)}
                </Grid>
            }
            {fetchResult.data?.items.length === 0 && <Status label="No results"/>}
            {fetchResult.errorMessage && <ErrorStatus label={fetchResult.errorMessage}/>}
        </Box>
    )
}