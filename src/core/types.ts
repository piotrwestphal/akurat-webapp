import {ProfileType} from './consts.ts'

export type AuthRes = Readonly<{ token: string, expiresIn: number, accessToken: string }>

export type ErrorResponse = Readonly<{ message: string }>

export type ProfileDto = Readonly<{
    id: string
    email: string
    profileType: ProfileType
    displayName: string
    instagramProfile: string
    profileImage?: ImageVariants
    createdAt: number
    updatedAt: number
}>

export type ProfilesDto = Readonly<{
    items: ProfileDto[]
    next?: string
}>

export type ImgRef = Readonly<{
    id: string
    key: string
    ext: string
    width: number
    height: number
}>

export type ImageVariants = Readonly<{
    prvw: ImgRef        // preview
    orig: ImgRef        // original
    thmb: ImgRef        // thumbnail
}>