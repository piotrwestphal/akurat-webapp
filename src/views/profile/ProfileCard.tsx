import {Card, CardContent, CardHeader, Chip} from '@mui/material'
import {Theme} from '@mui/material/styles'
import {SxProps} from '@mui/system'
import {ProfileType} from '../../core/consts.ts'
import {ProfileDto} from '../../core/types.ts'
import MonochromePhotosIcon from '@mui/icons-material/MonochromePhotos'
import BusinessIcon from '@mui/icons-material/Business'
import Face2Icon from '@mui/icons-material/Face2';

const cardContentStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    '&:last-child': {paddingBottom: 1},
    p: 1,
} satisfies SxProps<Theme>

const chipStyle = {
    fontSize: 12, m: '4px',
} satisfies SxProps<Theme>

type ProfileCardProps = Readonly<{
    dto: ProfileDto
}>

const Avatar = ({profileType}: {profileType: ProfileType}) => {
    switch (profileType) {
        case ProfileType.BRAND:
            return <BusinessIcon color="warning" />
        case ProfileType.MODEL:
            return <Face2Icon color="warning" />
        case ProfileType.PHOTO:
            return <MonochromePhotosIcon color="warning" />
    }
}
export const ProfileCard = ({dto}: ProfileCardProps) => {
    const {displayName, instagramProfile, profileType, email} = dto
    return (
        <Card sx={{m: 1}}>
            <CardHeader sx={{pl: 2, pr: 2, pt: 1, pb: 0}}
                        avatar={<Avatar profileType={profileType}/>}
                        titleTypographyProps={{variant: 'h6', sx: {fontWeight: 600}}}
                        subheaderTypographyProps={{fontSize: 12, fontWeight: 200}}
                        title={displayName}
                        subheader={email}
            />
            <CardContent sx={cardContentStyle}>
                <Chip color="success" sx={{...chipStyle, fontWeight: 600}} label={profileType}/>
                <Chip color="info" sx={chipStyle} label={`Instagram: ${instagramProfile}`}/>
            </CardContent>
        </Card>
    )
}