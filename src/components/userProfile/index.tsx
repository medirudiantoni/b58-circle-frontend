import { Box, HStack, Image, Text } from '@chakra-ui/react'
import { UserRound } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface UserProfileProps {
    userId: string,
    image?: string,
    fullname: string,
    username: string,
    bio?: string,
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, image, fullname, username, bio }) => {
    const navigate = useNavigate();
    return (
        <HStack w="100%" alignItems={ bio ? "start" : "center" }>
            <HStack
                role="button"
                onClick={() => navigate(`/profile/${userId}`)}
                justifyContent="center"
                w="40px"
                aspectRatio="1/1"
                bg="theme.500"
                borderRadius={100}
                overflow="hidden"
            >
                {image ? (
                    <Image src={image} w="100%" aspectRatio="1/1" objectFit="cover" borderRadius={100}></Image>
                ) : (
                    <UserRound />
                )}
            </HStack>
            <Box flex="1" h="fit-content">
                <Text fontSize="md" lineHeight={1.2}>{fullname}</Text>
                <Text fontSize="sm" color="#767676">@{username}</Text>
                {bio && (
                    <Text>{bio}</Text>
                )}
            </Box>
        </HStack>
    )
}

export default UserProfile