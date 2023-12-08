import {ChangeEvent, Dispatch, SetStateAction} from 'react'
import {uploadFile} from '../../core/file-uploader.ts'
import {HiddenInput} from './HiddenInput.tsx'

export type UploadedImage = Readonly<{
    file: File
    url: string
}>

type UploadImageProps = Readonly<{
    setUploadedImage: Dispatch<SetStateAction<UploadedImage | undefined>>
}>
export const UploadInput = ({
                                setUploadedImage,
                            }: UploadImageProps) => {
    const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const image = await uploadFile(file)
            setUploadedImage(image)
        } else {
            setUploadedImage(undefined)
        }
    }

    return (
        <HiddenInput type="file"
                     accept="image/*"
                     onChange={onUpload}/>
    )
}