import { Button } from '@mui/material'

type ContinueButtonProps = Readonly<{
    width: number
    formik: any
}>

export const ContinueButton = ({width, formik}: ContinueButtonProps) =>
    <Button sx={{width}}
            type="submit"
            disabled={formik.isSubmitting}
            variant="contained"
            size="large">Continue</Button>