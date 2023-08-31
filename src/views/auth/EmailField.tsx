import { TextField } from '@mui/material'

type EmailFieldProps = Readonly<{
    width: number
    formik: any
}>

export const EmailField = ({width, formik}: EmailFieldProps) =>
    <TextField sx={{width}}
               id="email"
               name="email"
               label="User email"
               value={formik.values.email}
               onChange={formik.handleChange}
               error={(formik.touched.email && Boolean(formik.errors.email))}
               helperText={(formik.touched.email && formik.errors.email) || ''}/>