import {Stack, Typography} from '@mui/material'
import Box from '@mui/material/Box'
import {HttpStatusCode} from 'axios'
import {useFormik} from 'formik'
import {FormikHelpers} from 'formik/dist/types'
import {useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import * as yup from 'yup'
import {Schema} from 'yup'
import {httpPost, HttpResult} from '../../core/http.client'
import {confirmSignupRoute, profileRoute, resetRoute, signUpRoute} from '../../core/routes'
import {AuthRes} from '../../core/types'
import {useAuth} from '../../ctx/AuthProvider'
import {MyLink} from '../common/MyLink.tsx'
import {ErrorStatus} from '../common/Status'
import {ContinueButton} from './ContinueButton'
import {EmailField} from './EmailField'
import {PasswordField} from './PasswordField'

type LoginDto = Readonly<{
    email: string
    password: string
}>

type LoginFormValues = Readonly<{
    email: string
    password: string
}>

const toReq = ({
                   email,
                   password,
               }: LoginFormValues): LoginDto => ({
    email,
    password,
})

type FetchResultState = HttpResult<{ token: string }>

const validationSchema = yup.object<LoginFormValues>({
    email: yup
        .string()
        .email()
        .required('User email is required'),
    password: yup
        .string()
        .required('Password is required'),
} satisfies Record<keyof LoginFormValues, Schema>)

const itemWidth = 300

export const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const auth = useAuth()
    const [fetchResult, setFetchResult] = useState<FetchResultState>({errorDetails: ''})

    const from = location.state?.from?.pathname || profileRoute
    const email = location.state?.email || ''
    const confirmationMessage = location.state?.confirmationMessage || null

    const onSubmit = (values: LoginFormValues,
                      {setSubmitting}: FormikHelpers<LoginFormValues>) => {
        setFetchResult({errorDetails: ''})
        httpPost<AuthRes>('/api/v1/auth/login', toReq(values))
            .then(({errorDetails, errorStatus, data}) => {
                setSubmitting(false)
                setFetchResult({errorDetails, errorStatus})
                if (data?.token) {
                    auth.login({...data, userEmail: values.email}, () => {
                        navigate(from, {replace: true})
                    })
                }
            })
    }

    const formik = useFormik<LoginFormValues>({initialValues: {email, password: ''}, validationSchema, onSubmit})

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
                <Typography variant="h6">Log in to proceed</Typography>
                {confirmationMessage &&
                    <Typography fontWeight="bold" color="green" variant="caption">{confirmationMessage}</Typography>}
                <EmailField width={itemWidth} formik={formik}/>
                <PasswordField width={itemWidth} formik={formik}/>
                <Box width={itemWidth} pb={1}>
                    <Typography variant="body2">
                        <MyLink to={resetRoute} state={{noRefresh: true}}>Forgot password?</MyLink>
                    </Typography>
                </Box>
                <ContinueButton width={itemWidth} formik={formik}/>
                <Typography variant="body2">Don't have an account? <MyLink to={signUpRoute}
                                                                           state={{noRefresh: true}}>Sign up</MyLink>
                </Typography>
                {fetchResult?.errorDetails && <ErrorStatus label={fetchResult.errorDetails}/>}
                {fetchResult?.errorStatus === HttpStatusCode.Conflict &&
                    <Typography variant="body2">Forgot to <MyLink to={confirmSignupRoute}
                                                                  state={{
                                                                      email: formik.values.email,
                                                                      noRefresh: true,
                                                                  }}>confirm</MyLink> your account?
                    </Typography>}
            </Stack>
        </form>
    )
}