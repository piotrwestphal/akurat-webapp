import {UploadedImage} from '../views/common/UploadInput.tsx'

export const uploadFile = async (file: File): Promise<UploadedImage> => {
    const reader = new FileReader()
    reader.readAsDataURL(file as File)
    return new Promise<UploadedImage>((res) => {
        reader.onloadend = () => {
            if (file) {
                res({
                    file,
                    url: reader.result as string,
                })
            }
        }
    })
}