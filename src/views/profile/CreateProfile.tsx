import {Stack, TextField} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepContent from '@mui/material/StepContent'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import {useFormik} from 'formik'
import {FormikHelpers} from 'formik/dist/types'
import {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import * as yup from 'yup'
import {Schema} from 'yup'
import {ProfileType} from '../../core/consts.ts'
import {httpGet, httpPost, HttpResult} from '../../core/http.client.ts'
import {homeRoute} from '../../core/routes.ts'
import {ImageRefDto, ProfileDto} from '../../core/types.ts'
import {ErrorStatus, LoadingStatus} from '../common/Status.tsx'
import {BaseInfoStep} from './BaseInfoStep.tsx'
import {ProfileTypeStep} from './ProfileTypeStep.tsx'
import {StepButtons} from './StepButtons.tsx'

export type CreateProfileFormValues = Readonly<{
    profileType: ProfileType
    displayName: string
    instagramProfile: string
    profileImage?: ImageRefDto
}>

const initialValues = {
    profileType: ProfileType.MODEL,
    displayName: '',
    instagramProfile: '',
    profileImage: undefined,
} satisfies CreateProfileFormValues

const validationSchema = yup.object<CreateProfileFormValues>({
    profileType: yup
        .string()
        .oneOf(Object.values(ProfileType), (params) => `The value should be one of the following: [${params.values}]`)
        .required('"Profile type" is required'),
    displayName: yup
        .string()
        .min(3, '"Display name" must be at least 3 characters')
        .required('"Display name" is required'),
    instagramProfile: yup.string(),
    profileImage: yup.object<ImageRefDto>({
        key: yup.string(),
        origKey: yup.string(),
        thumbKey: yup.string(),
    } satisfies Record<keyof ImageRefDto, Schema>),
} satisfies Record<keyof CreateProfileFormValues, Schema>)

type FetchResultState = HttpResult<{}> & Readonly<{ loading: boolean }>

type CreateProfileReq = Pick<ProfileDto, 'displayName' | 'profileType' | 'instagramProfile'>
    & { profileImage?: ImageRefDto }

const toReq = ({
                   displayName,
                   profileType,
                   instagramProfile,
                   profileImage,
               }: CreateProfileFormValues): CreateProfileReq => ({
    displayName,
    profileType,
    instagramProfile,
    profileImage,
})

export const CreateProfile = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [fetchResult, setFetchResult] = useState<FetchResultState>({loading: true})
    const [error, setError] = useState('')
    const [activeStep, setActiveStep] = useState(0)
    const onSubmit = async (values: CreateProfileFormValues,
                            {setSubmitting}: FormikHelpers<CreateProfileFormValues>) => {
        setError('')
        console.log({values})
        const result = await httpPost<ProfileDto>('/api/v1/profiles', toReq(values))
        setSubmitting(false)
        if (result.errorDetails) {
            setError(result.errorDetails)
        }
        if (result.data) {
            console.log(`Successfully added a profile`, result.data)
            navigate(homeRoute)
        }
    }
    const handleReset = () => {
        formik.resetForm()
        setError('')
        setActiveStep(0)
    }

    const formik = useFormik<CreateProfileFormValues>({
        initialValues, validationSchema, onSubmit,
    })

    const getCurrentProfile = () => {
        setFetchResult({loading: true})
        httpGet<ProfileDto>('/api/v1/profiles/me')
            .then(({data}) => {
                setFetchResult({loading: false, data})
                // TODO: restore below condition
                if (data && location.state?.from !== homeRoute) {
                    navigate(homeRoute)
                }
            })
    }

    useEffect(() => {
        getCurrentProfile()
    }, [])

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        }}>
            {fetchResult.loading && <LoadingStatus/>}
            {!fetchResult.loading && <Stack component="form"
                                            alignItems="center"
                                            onSubmit={formik.handleSubmit}
                                            autoComplete="off">
                <Typography mb={2} variant="h6">Create profile</Typography>
                <Stepper sx={{width: 300}} activeStep={activeStep} orientation="vertical">
                    <Step>
                        <StepLabel>Profile Type</StepLabel>
                        <StepContent>
                            <ProfileTypeStep formik={formik}/>
                            <StepButtons formik={formik}
                                         setActiveStep={setActiveStep}
                                         keys={['profileType']}
                                         backButton={false}/>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel error={!!formik.errors.displayName && formik.touched.displayName}>Base
                            Info</StepLabel>
                        <StepContent TransitionProps={{unmountOnExit: false}}>
                            <BaseInfoStep formik={formik}/>
                            <StepButtons formik={formik}
                                         keys={['displayName']}
                                         setActiveStep={setActiveStep}/>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel optional={<Typography variant="caption">Optional</Typography>}>
                            Profile Details</StepLabel>
                        <StepContent>
                            <TextField fullWidth
                                       id="intagramProfile"
                                       name="instagramProfile"
                                       label="Instagram profile name"
                                       value={formik.values.instagramProfile}
                                       onChange={formik.handleChange}
                                       helperText="Not need to be an instagram url"/>
                            <StepButtons formik={formik}
                                         keys={['instagramProfile']}
                                         setActiveStep={setActiveStep}
                                         label="Finish"/>
                        </StepContent>
                    </Step>
                </Stepper>
                {activeStep === 3 && (
                    <Box sx={{p: 3}}>
                        <Button onClick={handleReset}
                                sx={{mt: 1, mr: 1}}
                                disabled={formik.isSubmitting}>Reset</Button>
                        <Button type="submit"
                                sx={{mt: 1, mr: 1}}
                                variant="contained"
                                disabled={formik.isSubmitting || Object.keys(formik.errors).length > 0}>Join the
                            Kolektiv</Button>
                    </Box>
                )}
                {error && <ErrorStatus label={error}/>}
            </Stack>}
        </Box>
    )
}