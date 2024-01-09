import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CropIcon from '@mui/icons-material/Crop'
import DeleteIcon from '@mui/icons-material/Delete'
import FaceTwoToneIcon from '@mui/icons-material/FaceTwoTone'
import {Avatar, Box, CircularProgress, TextField} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import {useFormik} from 'formik'
import {useEffect, useState} from 'react'
import {uploadFile} from '../../core/file-uploader.ts'
import {httpPost, HttpResult} from '../../core/http.client.ts'
import {ImageVariants} from '../../core/types.ts'
import {ImageButton} from '../common/ImageButton.tsx'
import {ErrorStatus} from '../common/Status.tsx'
import {UploadedImage, UploadInput} from '../common/UploadInput.tsx'
import {CreateProfileFormValues} from './CreateProfile.tsx'
import {CropImageDialog} from './CropImageDialog.tsx'

type BaseInfoStepProps = Readonly<{
    formik: ReturnType<typeof useFormik<CreateProfileFormValues>>
}>
type FetchResultState = HttpResult<ImageVariants> & Readonly<{ loading: boolean }>
export const BaseInfoStep = ({
                                 formik,
                             }: BaseInfoStepProps) => {
    const [uploadedImage, setUploadedImage] = useState<UploadedImage>()
    const [fetchResult, setFetchResult] = useState<FetchResultState>({loading: false})
    const [open, setOpen] = useState(false)
    const [preview, setPreview] = useState('')

    const uploadProfileImage = () => {
        setFetchResult({loading: true})
        formik.setFieldValue('profileImage', null)
        const toUpload = preview.replace(/^.+?,/, '')
        httpPost<ImageVariants>('/api/v1/images', {image: toUpload})
            .then(({data, errorMessage}) => {
                setFetchResult({loading: false, data, errorMessage})
                if (data) {
                    formik.setFieldValue('profileImage', data)
                }
            })
    }

    useEffect(() => {
        if (uploadedImage) {
            setOpen(true)
        }
    }, [uploadedImage])

    useEffect(() => {
        if (preview) {
            uploadProfileImage()
        }
    }, [preview])

    const onDelete = () => {
        setUploadedImage(undefined)
        formik.setFieldValue('profileImage', null)
        setPreview('')
    }
    const onReset = async () => {
        if (uploadedImage) {
            const uploaded = await uploadFile(uploadedImage.file)
            setUploadedImage(uploaded)
        }
    }

    const onCancel = () => {
        setOpen(false)
        if (!preview) {
            setUploadedImage(undefined)
        }
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box sx={{display: 'flex', mb: 2}}>
                {formik.values.profileImage
                    ? <Avatar sx={{m: 2, width: 100, height: 100}} src={formik.values.profileImage.thmb.key}/>
                    : <Avatar sx={{m: 2, width: 100, height: 100, backgroundColor: '#CFD8DC'}}>
                        {fetchResult.loading ? <CircularProgress size={30} color="secondary"/> :
                            <FaceTwoToneIcon color="primary" sx={{width: 100}} fontSize="large"/>}
                    </Avatar>}
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    {!uploadedImage && <ImageButton disabled={fetchResult.loading}
                                                    component="label"
                                                    startIcon={<CloudUploadIcon/>}>Upload photo
                        <UploadInput setUploadedImage={setUploadedImage}/></ImageButton>}
                    {!!uploadedImage && <ImageButton disabled={fetchResult.loading}
                                                     startIcon={<CropIcon/>}
                                                     onClick={onReset}>Crop</ImageButton>}
                    {!!uploadedImage && <ImageButton disabled={fetchResult.loading}
                                                     startIcon={<DeleteIcon/>}
                                                     onClick={onDelete}>Delete</ImageButton>}
                    {fetchResult.errorMessage && <ErrorStatus label={fetchResult.errorMessage}/>}
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
            {uploadedImage && <Dialog open={open}
                                      onClose={onCancel}>
                <CropImageDialog uploadedImage={uploadedImage}
                                 setPreview={setPreview}
                                 setOpen={setOpen}
                                 onCancel={onCancel}/>
            </Dialog>}
        </Box>
    )
}
