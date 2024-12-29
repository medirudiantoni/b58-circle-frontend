import useUserStore from '@/hooks/userStore';
import { Box, Button, Heading, HStack, Img, Text, VStack } from '@chakra-ui/react'
import { Image, UserRound } from 'lucide-react';

interface UserProfileCardProps {
    profile?: string,
    background?: string,
    fullname: string,
    username: string,
    bio?: string,
    following: number | undefined,
    follower: number | undefined,
    onEditProfile?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile, background, fullname, username, bio, following, follower, onEditProfile }) => {
    const { userData } = useUserStore();
    return (
        <Box
            w="100%"
            px="0px"
            pb="0px"
        >
            <VStack
                w="100%"
                position="relative"
                gap={0}>
                <HStack justifyContent="center" w="100%" h="120px" bg="theme.400" borderRadius={10} overflow="hidden">
                    {background ? (
                        <Img
                            src={background}
                            w="100%"
                            h="100%"
                            borderRadius={10}
                            objectFit="cover"
                            objectPosition="center"
                        ></Img>
                    ) : (
                        <Image />
                    )}
                </HStack>
                <HStack
                    justifyContent="flex-end"
                    alignItems="end"
                    w="100%"
                    h="fit-content"
                    py="10px"
                    borderRadius={10}
                    objectFit="cover"
                    position="relative">
                    <HStack
                        justifyContent="center"
                        w="80px"
                        aspectRatio="1/1"
                        bg="theme.500"
                        position="absolute"
                        left="5%"
                        overflow="hidden"
                        borderRadius={100}
                        borderWidth={4}
                        borderColor="#262626">
                            {profile ? (
                                <Img
                                    src={profile}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                    className='object-bottom'
                                ></Img>
                            ) : (
                                <UserRound />
                            )}
                    </HStack>
                    {userData && onEditProfile ? (
                        <Button
                            onClick={onEditProfile}
                            borderRadius={100}
                            borderWidth={1}
                            bg="inherit"
                            color="inherit"
                            size="sm"
                            _hover={{ bg: "#323232" }}
                            _active={{ bg: "green.500" }}
                        >Edit Profile</Button>
                    ) : (
                        <Box p={4}></Box>
                    )}
                </HStack>
                <Box w="100%" pt="10px">
                    <Heading size="md" fontWeight="semibold" mb={0.5}>{fullname}</Heading>
                    <Text fontSize="xs" color="#767676" mb={0.5}>@{username}</Text>
                    <Text fontSize="md" mb={1.5}>{bio ? bio : "no bio yet"}</Text>
                    <HStack gap={3}>
                        <Text>
                            <span>{following}</span>
                            <span style={{ fontSize: "14px", marginLeft: "4px", color: "#808080" }}>Following</span>
                        </Text>
                        <Text>
                            <span>{follower}</span>
                            <span style={{ fontSize: "14px", marginLeft: "4px", color: "#808080" }}>Followers</span>
                        </Text>
                    </HStack>
                </Box>
            </VStack>
        </Box>
    )
}

export default UserProfileCard