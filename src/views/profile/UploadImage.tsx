import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LoadingButton from '@mui/lab/LoadingButton'
import {Button, styled} from '@mui/material'
import React, {ChangeEvent, JSX, useRef, useState} from 'react'
import ReactCrop, {centerCrop, type Crop, makeAspectCrop, PixelCrop} from 'react-image-crop'
import {canvasPreview} from './canvasPreview.ts'

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

// https://github.com/DominicTobias/react-image-crop#usage
export const UploadImage = (): JSX.Element => {
    const [crop, setCrop] = useState<Crop>()
    const imgRef = useRef<HTMLImageElement>(null)
    const previewCanvasRef = useRef<HTMLCanvasElement>(null)
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string>('')
    const [imageType, setImageType] = useState<string>('')
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

    const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        const file = event.target.files?.[0]
        console.log({file})
        const reader = new FileReader()

        reader.onloadend = () => {
            console.log({file, imageUrl, result: reader.result})
            setLoading(false)
            if (file) {
                setImageType(file.type)
                setImageUrl(reader.result as string)
            }
        }

        reader.readAsDataURL(file as File)
    }

    const onSave = async () => {
        const image = imgRef.current!
        const previewCanvas = previewCanvasRef.current!
        console.log('SAVE', image, previewCanvas)
        // This will size relative to the uploaded image
        // size. If you want to size according to what they
        // are looking at on screen, remove scaleX + scaleY
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        console.log('Natural, ', image.naturalWidth, image.naturalHeight)
        console.log('Natural 2, ', image.width, image.height)
        console.log('Natural 2, ', completedCrop!.width * scaleX, completedCrop!.height * scaleY)

        const offscreen = new OffscreenCanvas(
            completedCrop!.width * scaleX,
            completedCrop!.height * scaleY,
        )
        console.log({offscreen})
        const ctx = offscreen.getContext('2d')
        console.log({ctx})

        if (!ctx) {
            throw new Error('No 2d context')
        }
        ctx.drawImage(
            previewCanvas,
            0,
            0,
            previewCanvas.width,
            previewCanvas.height,
            0,
            0,
            offscreen.width,
            offscreen.height,
        )
        const blob = await offscreen.convertToBlob({
            type: imageType,
            quality: 1,
        })
        await canvasPreview(
            imgRef.current!,
            previewCanvasRef.current!,
            completedCrop!,
            1,
        )
        console.log({blob})
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

    // const onUpload = async () => {
    //
    // }

    return (
        <>
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
                {imageUrl && <Button sx={{ml: 2}} variant="contained" onClick={onSave}>Save</Button>}
            {imageUrl && <ReactCrop aspect={1}
                                    crop={crop}
                                    onChange={c => setCrop(c)}
                                    onComplete={setCompletedCrop}>
                <img ref={imgRef} src={imageUrl} alt="Uploaded Image" onLoad={onImageLoad}/>
            </ReactCrop>}
            {!!completedCrop && <canvas width={200} height={200}
                ref={previewCanvasRef}
                style={{
                    border: '1px solid black',
                    objectFit: 'contain',
                    width: completedCrop.width,
                    height: completedCrop.height,
                }}
            />}
        </>
    )
}