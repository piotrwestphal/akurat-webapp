export type AuthRes = Readonly<{ token: string, expiresIn: number, accessToken: string }>

export type ErrorResponse = Readonly<{ message: string }>

export type ProfileDto = {
    profileType: string
    displayName: string
    instagramProfile: string
}