import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import React, {Dispatch, SetStateAction, useRef, useState} from 'react'
import ReactCrop, {centerCrop, Crop, makeAspectCrop, PixelCrop} from 'react-image-crop'

type ImageDialogProps = Readonly<{
    open: boolean
    setImage: Dispatch<SetStateAction<string>>
    setOpen: Dispatch<SetStateAction<boolean>>
    imageUrl: string
    imageType: string
}>
export const ImageDialog = ({
                                imageUrl,
                                imageType,
                                open,
                                setOpen,
                                setImage,
                            }: ImageDialogProps) => {
    const [crop, setCrop] = useState<Crop>()
    const imgRef = useRef<HTMLImageElement>(null)
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const onSave = async () => {
        const canvas = document.createElement('canvas')
        const image = imgRef.current!
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        canvas.width = completedCrop?.width!
        canvas.height = completedCrop?.height!
        const ctx = canvas.getContext('2d')!

        const pixelRatio = window.devicePixelRatio
        canvas.width = completedCrop?.width! * pixelRatio
        canvas.height = completedCrop?.height! * pixelRatio
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(
            image,
            completedCrop!.x * scaleX,
            completedCrop!.y * scaleY,
            completedCrop!.width * scaleX,
            completedCrop!.height * scaleY,
            0,
            0,
            completedCrop!.width,
            completedCrop!.height,
        )
        const base64Image = canvas.toDataURL(imageType)
        setImage(base64Image)
        setOpen(false)
    }

    const onCancel = () => {
        setOpen(false)
    }

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const {width, height} = e.currentTarget
        setCrop(centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                1,
                width,
                height,
            ),
            width,
            height,
        ))
    }
    // const [fetchResult, setFetchResult] = useState<FetchResultState>({loading: true})
    // const [error, setError] = useState('')

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Select profile photo</DialogTitle>
            <DialogContent>
                <ReactCrop aspect={1}
                           circularCrop
                           ruleOfThirds
                           crop={crop}
                           onChange={c => setCrop(c)}
                           onComplete={setCompletedCrop}>
                    <img ref={imgRef}
                         src={imageUrl} alt="Uploaded Image"
                         onLoad={onImageLoad}/>
                </ReactCrop>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button variant="contained"
                        onClick={onSave}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}