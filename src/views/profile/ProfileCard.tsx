import {Avatar, Card, CardContent, CardHeader, Chip} from '@mui/material'
import {Theme} from '@mui/material/styles'
import {SxProps} from '@mui/system'
import {ProfileDto} from '../../core/types.ts'

const cardContentStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    '&:last-child': {paddingBottom: 1},
    p: 1,
} satisfies SxProps<Theme>

const chipStyle = {
    fontSize: 12, m: '4px',
} satisfies SxProps<Theme>

type ProfileCardProps = Readonly<{
    dto: ProfileDto
}>

export const ProfileCard = ({dto}: ProfileCardProps) => {
    const {displayName, instagramProfile, profileType, email} = dto
    return (
        <Card sx={{m: 1}}>
            <CardHeader sx={{pl: 2, pr: 2, pt: 1, pb: 0}}
                        avatar={dto.profileImage?.thmb.key ? <Avatar src={dto.profileImage.thmb.key}/>: 'N/A'}
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