import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CropIcon from '@mui/icons-material/Crop'
import DeleteIcon from '@mui/icons-material/Delete'
import FaceTwoToneIcon from '@mui/icons-material/FaceTwoTone'
import {Avatar, Box, TextField} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import {useFormik} from 'formik'
import {useEffect, useState} from 'react'
import {uploadFile} from '../../core/file-uploader.ts'
import {ImageButton} from '../common/ImageButton.tsx'
import {UploadedImage, UploadInput} from '../common/UploadInput.tsx'
import {CreateProfileFormValues} from './CreateProfile.tsx'
import {CropImageDialog} from './CropImageDialog.tsx'

type BaseInfoStepProps = Readonly<{
    formik: ReturnType<typeof useFormik<CreateProfileFormValues>>
}>
export const BaseInfoStep = ({
                                 formik,
                             }: BaseInfoStepProps) => {
    const [image, setImage] = useState<UploadedImage>()
    const [open, setOpen] = useState(false)
    const [preview, setPreview] = useState('')

    useEffect(() => {
        if (image) {
            setOpen(true)
        }
    }, [image])

    const onDelete = () => {
        setImage(undefined)
        setPreview('')
    }
    const onReset = async () => {
        if (image) {
            const uploaded = await uploadFile(image.file)
            setImage(uploaded)
        }
    }

    const onCancel = () => {
        setOpen(false)
        setImage(undefined)
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box sx={{display: 'flex', mb: 2}}>
                {preview
                    ? <Avatar sx={{m: 2, width: 100, height: 100}} src={preview}/>
                    : <Avatar sx={{m: 2, width: 100, height: 100, backgroundColor: '#CFD8DC'}}>
                        <FaceTwoToneIcon color="primary" sx={{width: 100}} fontSize="large"/>
                    </Avatar>}
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    {!image && <ImageButton component="label"
                                            startIcon={<CloudUploadIcon/>}>Upload photo
                        <UploadInput setImage={setImage}/></ImageButton>}
                    {!!image && <ImageButton startIcon={<CropIcon/>}
                                             onClick={onReset}>Crop</ImageButton>}
                    {!!image && <ImageButton startIcon={<DeleteIcon/>}
                                             onClick={onDelete}>Delete</ImageButton>}
                </Box>
            </Box>
            <TextField fullWidth
                       id="displayName"
                       name="displayName"
                       label="Display Name"
                       value={formik.values.displayName}
                       onChange={formik.handleChange}
                       error={formik.touched.displayName && Boolean(formik.errors.displayName)}
                       helperText={(formik.touched.displayName && formik.errors.displayName) ||
                           'What name will be displayed to other app users'}/>
            {image && <Dialog open={open}
                              onClose={onCancel}>
                <CropImageDialog image={image}
                                 setPreview={setPreview}
                                 setOpen={setOpen}
                                 onCancel={onCancel}/>
            </Dialog>}
        </Box>
    )
}
