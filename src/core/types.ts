import {ProfileType} from './consts.ts'

export type AuthRes = Readonly<{ token: string, expiresIn: number, accessToken: string }>

export type ErrorResponse = Readonly<{ message: string }>

export type ImageRefDto = Readonly<{
    key: string
    origKey: string
    thumbKey: string
}>

export type ProfileDto = Readonly<{
    id: string
    email: string
    profileType: ProfileType
    displayName: string
    instagramProfile: string
    profilePhoto: ImageRefDto
    createdAt: number
    updatedAt: number
}>

export type ProfilesDto = Readonly<{
    items: ProfileDto[]
    next?: string
}>