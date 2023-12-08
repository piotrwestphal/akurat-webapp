import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import React, {Dispatch, SetStateAction, useRef, useState} from 'react'
import ReactCrop, {centerCrop, Crop, makeAspectCrop, PixelCrop} from 'react-image-crop'
import {UploadedImage} from '../common/UploadInput.tsx'

type CropImageDialogProps = Readonly<{
    image: UploadedImage
    setPreview: Dispatch<SetStateAction<string>>
    setOpen: Dispatch<SetStateAction<boolean>>
    onCancel: () => void
}>
export const CropImageDialog = ({
                                    image,
                                    setPreview,
                                    setOpen,
                                    onCancel,
                                }: CropImageDialogProps) => {
    const imgRef = useRef<HTMLImageElement>(null)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

    const onSave = async () => {
        const canvas = document.createElement('canvas')
        const croppedImage = imgRef.current!
        const scaleX = croppedImage.naturalWidth / croppedImage.width
        const scaleY = croppedImage.naturalHeight / croppedImage.height
        canvas.width = completedCrop?.width!
        canvas.height = completedCrop?.height!
        const ctx = canvas.getContext('2d')!

        const pixelRatio = window.devicePixelRatio
        canvas.width = completedCrop?.width! * pixelRatio
        canvas.height = completedCrop?.height! * pixelRatio
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(
            croppedImage,
            completedCrop!.x * scaleX,
            completedCrop!.y * scaleY,
            completedCrop!.width * scaleX,
            completedCrop!.height * scaleY,
            0,
            0,
            completedCrop!.width,
            completedCrop!.height,
        )
        const base64CroppedImage = canvas.toDataURL(image.file.type)
        setPreview(base64CroppedImage)
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

    return (
        <>
            <DialogTitle>Select profile photo</DialogTitle>
            <DialogContent>
                <ReactCrop aspect={1}
                           circularCrop
                           ruleOfThirds
                           crop={crop}
                           onChange={c => setCrop(c)}
                           onComplete={setCompletedCrop}>
                    <img ref={imgRef}
                         src={image.url} alt="Uploaded Image"
                         onLoad={onImageLoad}/>
                </ReactCrop>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button variant="contained"
                        onClick={onSave}>Save</Button>
            </DialogActions>
        </>

    )
}