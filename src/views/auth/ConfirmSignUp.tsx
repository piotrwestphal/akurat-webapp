import {Stack, TextField, Typography} from '@mui/material'
import {useFormik} from 'formik'
import {FormikHelpers} from 'formik/dist/types'
import {useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import * as yup from 'yup'
import {Schema} from 'yup'
import {httpAuthPost, HttpResult} from '../../core/http.client'
import {loginRoute, signUpRoute} from '../../core/routes'
import {MyLink} from '../common/MyLink.tsx'
import {ErrorStatus} from '../common/Status'
import {ContinueButton} from './ContinueButton'
import {EmailField} from './EmailField'

type ConfirmSignupDto = Readonly<{
    email: string
    confirmationCode: string
}>

export type ConfirmSignupFormValues = Readonly<{
    email: string
    code: string
}>

const toReq = ({
                   email,
                   code,
               }: ConfirmSignupFormValues): ConfirmSignupDto => ({
    email,
    confirmationCode: code,
})

type FetchResultState = HttpResult<{ message: string }>

const validationSchema = yup.object<ConfirmSignupFormValues>({
    email: yup
        .string()
        .email()
        .required('User email is required'),
    code: yup
        .string()
        .min(6)
        .max(6)
        .required('Valid confirmation code is required'),
} satisfies Record<keyof ConfirmSignupFormValues, Schema>)

const itemWidth = 300

export const ConfirmSignUp = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const email = location.state?.email || ''

    const [fetchResult, setFetchResult] = useState<FetchResultState>({errorDetails: ''})

    const onSubmit = (values: ConfirmSignupFormValues,
                      {setSubmitting}: FormikHelpers<ConfirmSignupFormValues>) => {
        setFetchResult({errorDetails: ''})
        httpAuthPost<{ message: string }>('/api/v1/confirm-signup', toReq(values))
            .then(({errorDetails, data}) => {
                setSubmitting(false)
                setFetchResult({errorDetails})
                if (data) {
                    navigate(loginRoute, {
                        state: {
                            noRefresh: true,
                            email: values.email,
                            confirmationMessage: data.message,
                        },
                    })
                }
            })
    }

    const formik = useFormik<ConfirmSignupFormValues>({
        initialValues: {email, code: ''}, validationSchema, onSubmit,
    })

    return (
        <form onSubmit={formik.handleSubmit}
              style={{
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
              }}>
            <Stack spacing={2}
                   alignItems="center">
                <Typography variant="h6">Confirm an account</Typography>
                {email && <>
                    <Typography variant="caption">Provide a confirmation code for email:</Typography>
                    <Typography variant="body2">{email}</Typography>
                </>}
                {!email && <EmailField width={itemWidth} formik={formik}/>}
                <TextField sx={{width: itemWidth}}
                           id="code"
                           name="code"
                           label="Confirmation code"
                           value={formik.values.code}
                           onChange={formik.handleChange}
                           error={formik.touched.code && Boolean(formik.errors.code)}
                           helperText={(formik.touched.code && formik.errors.code) || ''}/>
                <ContinueButton width={itemWidth} formik={formik}/>
                <Typography variant="body2">Didn't receive the code? <MyLink to={signUpRoute}
                                                                             state={{noRefresh: true}}>Please try to
                    reset again</MyLink>
                </Typography>
                {fetchResult?.errorDetails && <ErrorStatus label={fetchResult.errorDetails}/>}
            </Stack>
        </form>
    )
}