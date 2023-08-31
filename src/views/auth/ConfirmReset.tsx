import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Schema } from 'yup'
import { FormikHelpers } from 'formik'
import { Stack, TextField, Typography } from '@mui/material'
import { httpPost, HttpResult } from '../../core/http.client'
import { ErrorStatus } from '../common/Status'
import { loginRoute, resetRoute } from '../../core/routes'
import { EmailField } from './EmailField'
import { ContinueButton } from './ContinueButton'
import { PasswordField } from './PasswordField'

type ConfirmResetDto = Readonly<{
    email: string
    password: string
    confirmationCode: string
}>

export type ConfirmResetFormValues = Readonly<{
    email: string
    password: string
    code: string
}>

const toReq = ({
                   email,
                   password,
                   code
               }: ConfirmResetFormValues): ConfirmResetDto => ({
    email,
    password,
    confirmationCode: code,
})

type ConfirmResetRes = Readonly<{ message: string }>

type FetchResultState = HttpResult<ConfirmResetRes>

const validationSchema = yup.object<ConfirmResetFormValues>({
    email: yup
        .string()
        .email()
        .required('User email is required'),
    password: yup
        .string()
        .required('Password is required'),
    code: yup
        .string()
        .min(6)
        .max(6)
        .required('Valid confirmation code is required')
} satisfies Record<keyof ConfirmResetFormValues, Schema>)

const itemWidth = 300

export const ConfirmReset = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const email = location.state?.email || ''

    const [fetchResult, setFetchResult] = useState<FetchResultState>({errorDetails: ''})

    const onSubmit = (values: ConfirmResetFormValues,
                      {setSubmitting}: FormikHelpers<ConfirmResetFormValues>) => {
        setFetchResult({errorDetails: ''})
        httpPost<ConfirmResetRes>('/v1/auth/confirm-forgot', toReq(values))
            .then(({errorDetails, data}) => {
                setSubmitting(false)
                setFetchResult({errorDetails})
                if (data) {
                    navigate(loginRoute, {
                        state: {noRefresh: true, email: values.email, confirmationMessage: data.message}
                    })
                }
            })
    }

    const formik = useFormik<ConfirmResetFormValues>({
        initialValues: {email, password: '', code: ''},
        validationSchema,
        onSubmit
    })

    return (
        <form onSubmit={formik.handleSubmit}
              style={{
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
              }}>
            <Stack spacing={2}
                   alignItems="center">
                <Typography variant="h6">Confirm password reset</Typography>
                {!email &&
                    <Typography width={itemWidth} align="center" variant="caption">Enter your email address and the new
                        password and confirmation code received on your email address</Typography>}
                {email && <Typography variant="caption">Provide a new password and a confirmation code for
                    email:</Typography>}
                {email && <Typography variant="body2">{email}</Typography>}
                {!email && <EmailField width={itemWidth} formik={formik}/>}
                <PasswordField width={itemWidth} formik={formik} label="New password"/>
                <TextField sx={{width: itemWidth}}
                           id="code"
                           name="code"
                           label="Confirmation code"
                           value={formik.values.code}
                           onChange={formik.handleChange}
                           error={formik.touched.code && Boolean(formik.errors.code)}
                           helperText={(formik.touched.code && formik.errors.code) || ''}/>
                <ContinueButton width={itemWidth} formik={formik}/>
                <Typography variant="body2">Didn't receive the code? <Link style={{textDecoration: 'none'}}
                                                                           to={resetRoute}
                                                                           state={{noRefresh: true}}>Please try to reset
                    again</Link>
                </Typography>
                {fetchResult?.errorDetails && <ErrorStatus label={fetchResult.errorDetails}/>}
            </Stack>
        </form>
    )
}