import {FormControl, FormControlLabel, Radio, RadioGroup, Stack, TextField} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepContent from '@mui/material/StepContent'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import {useFormik} from 'formik'
import {FormikHelpers} from 'formik/dist/types'
import {JSX, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import * as yup from 'yup'
import {Schema} from 'yup'
import {ProfileType} from '../../core/consts.ts'
import {httpGet, httpPost, HttpResult} from '../../core/http.client.ts'
import {homeRoute} from '../../core/routes.ts'
import {ProfileDto} from '../../core/types.ts'
import {ErrorStatus, LoadingStatus} from '../common/Status.tsx'
import {UploadImage} from './UploadImage.tsx'

export type CreateProfileFormValues = Readonly<{
    profileType: ProfileType
    displayName: string
    instagramProfile: string
}>

const initialValues = {
    profileType: ProfileType.MODEL,
    displayName: '',
    instagramProfile: '',
} satisfies CreateProfileFormValues

const validationSchema = yup.object<CreateProfileFormValues>({
    profileType: yup
        .string()
        .oneOf(Object.values(ProfileType), (params) => `The value should be one of the following: [${params.values}]`)
        .required('"Profile type" is required'),
    displayName: yup
        .string()
        .required('"Display name" is required'),
    instagramProfile: yup.string(),
} satisfies Record<keyof CreateProfileFormValues, Schema>)

type FetchResultState = HttpResult<{}> & Readonly<{ loading: boolean }>

const toReq = ({
                   displayName,
                   profileType,
                   instagramProfile,
               }: CreateProfileFormValues): Pick<ProfileDto, 'displayName' | 'profileType' | 'instagramProfile'> => ({
    displayName,
    profileType,
    instagramProfile,
})

// TODO: add validating on continue -> formik.validateField
export const CreateProfile = (): JSX.Element => {
    const navigate = useNavigate()
    const [fetchResult, setFetchResult] = useState<FetchResultState>({loading: true})
    const [error, setError] = useState('')
    const [activeStep, setActiveStep] = useState(0)

    const onSubmit = async (values: CreateProfileFormValues,
                            {setSubmitting}: FormikHelpers<CreateProfileFormValues>) => {
        setError('')
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

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleReset = () => {
        formik.resetForm()
        setError('')
        setActiveStep(0)
    }

    const formik = useFormik<CreateProfileFormValues>({
        initialValues, validationSchema, onSubmit,
    })

    const Buttons = ({label = 'Continue', backButton = true}) =>
        <Box mt={2} sx={{width: 270, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
            {backButton && <Button onClick={handleBack}
                                   sx={{mt: 1, mr: 1}}>Back</Button>}
            <Button variant="contained"
                    onClick={handleNext}
                    sx={{
                        mt: 1,
                        mr: 1,
                    }}>{label}</Button>
        </Box>

    const getCurrentProfile = () => {
        setFetchResult({loading: true})
        httpGet<ProfileDto>('/api/v1/profiles/me')
            .then(({data}) => {
                setFetchResult({loading: false, data})
                // TODO: restore below condition
                // if (data) {
                //     navigate(homeRoute)
                // }
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
                            <FormControl>
                                <RadioGroup onChange={formik.handleChange}
                                            value={formik.values.profileType}>
                                    <FormControlLabel name="profileType"
                                                      value={ProfileType.MODEL}
                                                      control={<Radio/>}
                                                      label="Model"/>
                                    <FormControlLabel name="profileType"
                                                      value={ProfileType.PHOTO}
                                                      control={<Radio/>}
                                                      label="Photographer"/>
                                    <FormControlLabel name="profileType"
                                                      value={ProfileType.BRAND}
                                                      control={<Radio/>}
                                                      label="Brand"/>
                                </RadioGroup>
                            </FormControl>
                            {<Buttons backButton={false}/>}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Base Info</StepLabel>
                        <StepContent>
                            <TextField fullWidth
                                       id="displayName"
                                       name="displayName"
                                       label="Display Name"
                                       value={formik.values.displayName}
                                       onChange={formik.handleChange}
                                       error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                                       helperText={(formik.touched.displayName && formik.errors.displayName) ||
                                           'What name will be displayed to other Kolektiv users'}/>
                            {<Buttons/>}
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel optional={<Typography variant="caption">Optional</Typography>}>Profile
                            Details</StepLabel>
                        <StepContent>
                            <TextField fullWidth
                                       id="intagramProfile"
                                       name="instagramProfile"
                                       label="Instagram profile name"
                                       value={formik.values.instagramProfile}
                                       onChange={formik.handleChange}
                                       helperText="Not need to be an instagram url"/>
                            <Buttons/>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel optional={<Typography variant="caption">Optional</Typography>}>Upload profile
                            photo</StepLabel>
                        <StepContent>
                            <UploadImage/>
                            <Buttons label="Finish"/>
                        </StepContent>
                    </Step>
                </Stepper>
                {activeStep === 4 && (
                    <Box sx={{p: 3}}>
                        <Typography mb={2}>All steps completed</Typography>
                        <Button onClick={handleReset}
                                sx={{mt: 1, mr: 1}}
                                disabled={formik.isSubmitting}>Reset</Button>
                        <Button type="submit"
                                sx={{mt: 1, mr: 1}}
                                variant="contained"
                                disabled={formik.isSubmitting}>Join the Kolektiv</Button>
                    </Box>
                )}
                {error && <ErrorStatus label={error}/>}
            </Stack>}
        </Box>
    )
}