import Cookies from 'js-cookie';
import useUserStore from '@/hooks/userStore';
import { Box, Button, Heading, HStack, Img, Spinner } from '@chakra-ui/react'
import { ImagePlus, UserRoundPen, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { fetchUpdateUser } from '@/features/auth/services/auth-service';
import retrieveCurrentUser from '@/features/auth/functions/user.current';

interface EditProfileModalProps {
    onClose: () => void,
}

interface InputValueType {
    background?: File,
    profile?: File,
    fullname: string,
    username: string,
    bio: string
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
    const { userData, setUser, setUserData } = useUserStore();
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const [isInputValue, setIsInputValue] = useState<InputValueType>({
        fullname: "",
        username: "",
        bio: ""
    });
    const [isImage, setIsImage] = useState({
        profile: "",
        background: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsImage({
            profile: userData?.profile ? userData.profile : 'null',
            background: userData?.background ? userData.background : 'null'
        });
    }, [userData]);

    useEffect(() => {
        setIsInputValue({
            fullname: String(userData!.fullname),
            username: String(userData!.username),
            bio: String(userData!.bio)
        });
    }, [userData]);

    const handleBackgroundImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsInputValue({ ...isInputValue, background: file });
            const imageUrl = URL.createObjectURL(file);
            setIsImage({ ...isImage, background: imageUrl });
        }
    }
    const handleProfileImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsInputValue({ ...isInputValue, profile: file });
            const imageUrl = URL.createObjectURL(file);
            setIsImage({ ...isImage, profile: imageUrl });
        }
    }

    const onSubmitDataUpdateUser = async () => {
        setIsLoading(true);
        const token = Cookies.get("token");
        console.log("datanya: ", isInputValue);
        await fetchUpdateUser(String(token), String(userData?.id), isInputValue)
            .then(res => {
                console.log(res);
                retrieveCurrentUser(setUserData, setUser);
                setIsLoading(false);
            })
            .then(() => onClose())
            .catch(error => console.log(error))
    };

    return (
        <HStack justifyContent="center" alignItems="start" pt={10} position="fixed" zIndex={12} top={0} bottom={0} left={0} right={0}>
            <Box role='button' cursor="default" onClick={onClose} position="absolute" top={0} left={0} w="100%" h="100%" className='bg-black/70'></Box>

            {/* modal Box start */}
            <Box w="100%" maxW="lg" h="fit-content" borderRadius={16} bg="theme.700" position="relative" overflow="hidden" zIndex={1}>

                {isLoading && (
                    <HStack position="absolute" justifyContent="center" zIndex={2} w="100%" h="100%" top={0} left={0} className='bg-black/75'>
                        <Spinner size="xl" borderWidth="4px" color='white' />
                    </HStack>
                )}

                <HStack justifyContent="space-between" p={4} pb={0}>
                    <Heading size="md" fontWeight="medium" color="white">Edit profile</Heading>
                    <Box role='button' onClick={onClose} p={2} borderRadius={100} bg="theme.600" aspectRatio="1/1">
                        <X size="20px" />
                    </Box>
                </HStack>
                <Box w="100%" borderBottomWidth={1} borderColor="theme.500" p={4} pt={2}>
                    <Box position="relative" w="100%" h="fit-content" pb="50px" mb={2}>

                        {/* Profile Background Start */}
                        <Box position="relative" w="100%" aspectRatio="7/2" borderRadius={10} bg="theme.400" overflow="hidden">
                            {isImage.background == 'null' ? (
                                <HStack role='button' onClick={() => backgroundInputRef.current?.click()} justifyContent="center" w="100%" h="100%" position="relative">
                                    <ImagePlus size="36px" />
                                </HStack>
                            ) : (
                                <Box position="relative" w="100%" h="100%">
                                    <Img src={isImage.background} w="100%" h="100%" objectFit="cover" position="relative" />
                                    <HStack position="absolute" w="100%" h="100%" top={0} left={0} justifyContent="center" bg="black" opacity="0%" _hover={{ opacity: "50%" }}>
                                        <Button onClick={() => backgroundInputRef.current?.click()} variant="outline" color="inherit" _hover={{ bg: "white", color: "black" }}>Edit Image</Button>
                                    </HStack>
                                </Box>
                            )}
                        </Box>
                        <input onChange={handleBackgroundImageFile} ref={backgroundInputRef} type='file' className='hidden'></input>
                        {/* Profile Background End */}

                        {/* Profile picture start */}
                        <Box w="90px" aspectRatio="1/1" borderRadius={100} overflow="hidden" bg="theme.400" position="absolute" bottom={0} left="30px" borderWidth="4.5px" borderColor="theme.700">
                            {isImage.profile == 'null' ? (
                                <HStack role='button' onClick={() => profileInputRef.current?.click()} w="100%" h="100%" justifyContent="center">
                                    <UserRoundPen size="36px" style={{ transform: 'translateX(3px)' }} />
                                </HStack>
                            ) : (
                                <Box position="relative" w="100%" h="100%">
                                    <Img src={isImage.profile} w="100%" h="100%" objectFit="cover" objectPosition="top" position="relative" />
                                    <HStack position="absolute" w="100%" h="100%" top={0} left={0} justifyContent="center" bg="black" opacity="0%" _hover={{ opacity: "50%" }}>
                                        <Button onClick={() => profileInputRef.current?.click()} variant="outline" color="inherit" _hover={{ bg: "white", color: "black" }}>Edit</Button>
                                    </HStack>
                                </Box>
                            )}
                        </Box>
                        <input onChange={handleProfileImageFile} ref={profileInputRef} type='file' className='hidden'></input>
                        {/* Profile picture end */}

                    </Box>
                    <form className='w-full'>
                        <Box py={2} px={2} mb={4} w="100%" h="fit-content" borderWidth={1} borderRadius={6} borderColor="theme.500">
                            <label htmlFor='fullname' className='leading-3 block text-sm mb-0.5'>Name</label>
                            <input
                                onChange={(e) => setIsInputValue({ ...isInputValue, fullname: e.target.value })}
                                type='text' id='fullname' value={isInputValue?.fullname !== "null" ? isInputValue.fullname : ""} placeholder='Your fullname' className='w-full border-0 outline-none ring-0 text-lg bg-inherit px-2'></input>
                        </Box>
                        <Box py={2} px={2} mb={4} w="100%" h="fit-content" borderWidth={1} borderRadius={6} borderColor="theme.500">
                            <label htmlFor='username' className='leading-3 block text-sm mb-0.5'>Username</label>
                            <input
                                onChange={(e) => setIsInputValue({ ...isInputValue, username: e.target.value })}
                                type='text' id='username' value={isInputValue?.username} className='w-full border-0 outline-none ring-0 text-lg bg-inherit px-2'></input>
                        </Box>
                        <Box py={2} px={2} mb={4} w="100%" h="fit-content" borderWidth={1} borderRadius={6} borderColor="theme.500">
                            <label
                                htmlFor='bio' className='leading-3 block text-sm mb-0.5'>Bio</label>
                            <textarea
                                onChange={(e) => setIsInputValue({ ...isInputValue, bio: e.target.value })}
                                rows={3} id='bio' value={isInputValue?.bio !== "null" ? isInputValue.bio : ""} className='w-full border-0 outline-none ring-0 text-lg bg-inherit px-2'></textarea>
                        </Box>
                    </form>
                </Box>
                <HStack w="100%" p={5} justifyContent="flex-end">
                    <Button onClick={onSubmitDataUpdateUser} borderRadius={100} px={5} bg="brand.500" color="white">Save</Button>
                </HStack>
            </Box>
            {/* modal Box end */}

        </HStack>
    )
}

export default EditProfileModal