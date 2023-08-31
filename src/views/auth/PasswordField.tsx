import { TextField } from '@mui/material'

type PasswordFieldProps = Readonly<{
    width: number
    formik: any
    label?: string
}>

export const PasswordField = ({width, formik, label = 'Password'}: PasswordFieldProps) =>
    <TextField sx={{width}}
               type="password"
               id="password"
               name="password"
               label={label}
               autoComplete="on"
               value={formik.values.password}
               onChange={formik.handleChange}
               error={formik.touched.password && Boolean(formik.errors.password)}
               helperText={(formik.touched.password && formik.errors.password) || ''}/>