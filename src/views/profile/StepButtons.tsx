import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import {useFormik} from 'formik'
import {Dispatch, SetStateAction} from 'react'
import {CreateProfileFormValues} from './CreateProfile.tsx'

type StepButtonsProps = Readonly<{
    formik: ReturnType<typeof useFormik<CreateProfileFormValues>>
    setActiveStep: Dispatch<SetStateAction<number>>
    keys?: Array<keyof CreateProfileFormValues>
    label?: string
    backButton?: boolean
}>
export const StepButtons = ({
                                formik,
                                setActiveStep,
                                keys = [],
                                label = 'Continue',
                                backButton = true,
                            }: StepButtonsProps) => {
    const handleNext = async () => {
        const pendingTouched = keys?.map(key => formik.setFieldTouched(key))
        await Promise.all(pendingTouched)
        if (keys?.some(key => !!formik.errors[key])) {
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1)
        }
    }
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
    return (
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
    )
}