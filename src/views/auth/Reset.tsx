import {Stack, Typography} from '@mui/material'
import {useFormik} from 'formik'
import {FormikHelpers} from 'formik/dist/types'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import * as yup from 'yup'
import {Schema} from 'yup'
import {httpPost, HttpResult} from '../../core/http.client'
import {confirmResetRoute, loginRoute} from '../../core/routes'
import {MyLink} from '../common/MyLink.tsx'
import {ErrorStatus} from '../common/Status'
import {ContinueButton} from './ContinueButton'
import {EmailField} from './EmailField'

type ResetDto = Readonly<{
    email: string
}>

type ResetFormValues = Readonly<{
    email: string
}>

const toReq = ({email}: ResetFormValues): ResetDto => ({email})

type ForgotRes = Readonly<{
    codeDeliveryDetails?: Readonly<{
        deliveryMedium: string
        destination: string
    }>
}>

type FetchResultState = HttpResult<ForgotRes>

const validationSchema = yup.object<ResetFormValues>({
    email: yup
        .string()
        .email()
        .required('User email is required'),
} satisfies Record<keyof ResetFormValues, Schema>)

const itemWidth = 300

export const Reset = () => {
    const navigate = useNavigate()
    const [fetchResult, setFetchResult] = useState<FetchResultState>({errorDetails: ''})

    const onSubmit = (values: ResetFormValues,
                      {setSubmitting}: FormikHelpers<ResetFormValues>) => {
        setFetchResult({errorDetails: ''})
        httpPost<ForgotRes>('/api/v1/auth/forgot', toReq(values))
            .then(({errorDetails, data}) => {
                console.log({errorDetails, data})
                setSubmitting(false)
                setFetchResult({errorDetails})
                if (data?.codeDeliveryDetails) {
                    navigate(confirmResetRoute, {state: {email: values.email}})
                }
            })
    }

    const formik = useFormik<ResetFormValues>({initialValues: {email: ''}, validationSchema, onSubmit})

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
                <Typography variant="h6">Reset your password</Typography>
                <Typography width={itemWidth} align="center" variant="caption">Enter your email address and we will send
                    you a code to reset your password</Typography>
                <EmailField width={itemWidth} formik={formik}/>
                <ContinueButton width={itemWidth} formik={formik}/>
                <Typography variant="body2">
                    <MyLink to={loginRoute}
                            state={{noRefresh: true}}>Back to login screen</MyLink>
                </Typography>
                {fetchResult?.errorDetails && <ErrorStatus label={fetchResult.errorDetails}/>}
            </Stack>
        </form>
    )
}