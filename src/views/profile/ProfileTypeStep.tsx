import {FormControlLabel, Radio, RadioGroup} from '@mui/material'
import {useFormik} from 'formik'
import {ProfileType} from '../../core/consts.ts'
import {CreateProfileFormValues} from './CreateProfile.tsx'

type ProfileTypeStepProps = Readonly<{
    formik: ReturnType<typeof useFormik<CreateProfileFormValues>>
}>
export const ProfileTypeStep = ({
                                 formik,
                             }: ProfileTypeStepProps) =>
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