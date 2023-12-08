import {ChangeEvent, Dispatch, SetStateAction} from 'react'
import {uploadFile} from '../../core/file-uploader.ts'
import {HiddenInput} from './HiddenInput.tsx'

export type UploadedImage = Readonly<{
    file: File
    url: string
}>

type UploadImageProps = Readonly<{
    setImage: Dispatch<SetStateAction<UploadedImage | undefined>>
}>
export const UploadInput = ({
                                setImage,
                            }: UploadImageProps) => {
    const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const uploaded = await uploadFile(file)
            setImage(uploaded)
        } else {
            setImage(undefined)
        }
    }

    return (
        <HiddenInput type="file"
                     accept="image/*"
                     onChange={onUpload}/>
    )
}