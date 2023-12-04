import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import LoadingButton from '@mui/lab/LoadingButton'
import {Avatar, styled, Tooltip} from '@mui/material'
import Box from '@mui/material/Box'
import {ChangeEvent, useState} from 'react'
import {dict_dialog_tooltip_uploadButton} from '../../core/dictionary.ts'
import {ImageDialog} from './ImageDialog.tsx'

const VisuallyHiddenInput = styled('input')({
    // clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

// type FetchResultState = HttpResult<{}> & Readonly<{ loading: boolean }>
// const toReq = ({}: any) => ({})
export const ProfileImageStep = () => {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [imageType, setImageType] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [image, setImage] = useState('')
    const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setLoading(false)
                if (file) {
                    setImageType(file.type)
                    setImageUrl(reader.result as string)
                    setOpen(true)
                }
            }
            reader.readAsDataURL(file as File)
        } else {
            setImageType('')
            setImageUrl('')
            setLoading(false)
        }
    }

    // TODO: add reset button for loaded photo
    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                <LoadingButton component="label"
                               variant="contained"
                               color="primary"
                               loading={loading}
                               loadingPosition="start"
                               startIcon={<CloudUploadIcon/>}>Upload
                    <VisuallyHiddenInput type="file"
                                         accept="image/*"
                                         onChange={onUpload}/>
                </LoadingButton>
                <Tooltip enterTouchDelay={0}
                         leaveTouchDelay={5000}
                         title={dict_dialog_tooltip_uploadButton}>
                    <HelpOutlineIcon sx={{ml: 1}} color="info"/>
                </Tooltip>
            </Box>
            {image && <Box sx={{mt: 2, display: 'flex', justifyContent: 'center'}}>
                <Avatar alt="Profile image"
                        src={image}
                        sx={{width: 150, height: 150}}/>
            </Box>}
            <ImageDialog open={open}
                         setImage={setImage}
                         imageUrl={imageUrl}
                         imageType={imageType}
                         setOpen={setOpen}/>
        </Box>

    )
}