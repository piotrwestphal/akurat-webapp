import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Schema } from 'yup'
import { FormikHelpers } from 'formik/dist/types'
import { Stack, Typography } from '@mui/material'
import { httpPost, HttpResult } from '../../core/http.client'
import { ErrorStatus } from '../common/Status'
import { confirmSignupRoute, loginRoute } from '../../core/routes'
import { EmailField } from './EmailField'
import { PasswordField } from './PasswordField'
import { ContinueButton } from './ContinueButton'

type SignupDto = Readonly<{
    email: string
    password: string
}>

export type SignupFormValues = Readonly<{
    email: string
    password: string
}>

const toReq = ({
                   email,
                   password
               }: SignupFormValues): SignupDto => ({
    email,
    password,
})

export type SignUpRes = Readonly<{
    userConfirmed: boolean
    userSub: string
    codeDeliveryDetails?: Readonly<{
        deliveryMedium: string
        destination: string
    }>
}>

type FetchResultState = HttpResult<{ confirmed: boolean }>

const validationSchema = yup.object<SignupFormValues>({
    email: yup
        .string()
        .email()
        .required('User email is required'),
    password: yup
        .string()
        .required('Password is required')
} satisfies Record<keyof SignupFormValues, Schema>)

const itemWidth = 300

export const SignUp = () => {
    const navigate = useNavigate()
    const [fetchResult, setFetchResult] = useState<FetchResultState>({errorDetails: ''})

    const onSubmit = (values: SignupFormValues,
                      {setSubmitting}: FormikHelpers<SignupFormValues>) => {
        setFetchResult({errorDetails: ''})
        httpPost<SignUpRes>('/api/v1/auth/signup', toReq(values))
            .then(({errorDetails, data}) => {
                setSubmitting(false)
                setFetchResult({errorDetails})
                if (data?.userConfirmed) {
                    navigate(loginRoute, {
                        state: {
                            noRefresh: true,
                            confirmationMessage: 'Account has been confirmed',
                            email: values.email
                        }
                    })
                }
                if (data?.codeDeliveryDetails) {
                    navigate(confirmSignupRoute, {state: {email: values.email}})
                }
            })
    }

    const formik = useFormik<SignupFormValues>({initialValues: {email: '', password: ''}, validationSchema, onSubmit})

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
                <Typography variant="h6">Create an account</Typography>
                <Typography variant="caption">Please note that email verification is required for signup.</Typography>
                <EmailField width={itemWidth} formik={formik}/>
                <PasswordField width={itemWidth} formik={formik}/>
                <ContinueButton width={itemWidth} formik={formik}/>
                <Typography variant="body2">Already have an account? <Link style={{textDecoration: 'none'}}
                                                                           to={loginRoute}
                                                                           state={{noRefresh: true}}>Log in</Link>
                </Typography>
                {fetchResult?.errorDetails && <ErrorStatus label={fetchResult.errorDetails}/>}
            </Stack>
        </form>
    )
}