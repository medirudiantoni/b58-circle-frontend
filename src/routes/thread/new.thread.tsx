import retrieveAllThreads from '@/features/threads/functions/thread.fetch';
import useThreadStore from '@/hooks/threadStore';
import useUserStore from '@/hooks/userStore'
import MainLayout from '@/layouts'
import { Box, Button, HStack, Img, Input, Spinner, Text, Textarea } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import z from "zod";
import { createNewThread } from '@/features/threads/services/thread.services';
import addImage from "@/assets/add-image.svg";
import { X } from 'lucide-react';

const threadSchema = z.object({
    content: z.string().min(2, "post min 2 characters").max(280, "max 280 characters"),
});

type ThreadInput = z.infer<typeof threadSchema>

const CreateNewThreadPage = () => {
    const { userData } = useUserStore();
    const { setThreads } = useThreadStore();
    const { register, handleSubmit } = useForm<ThreadInput>({
        resolver: zodResolver(threadSchema)
    });

    const navigate = useNavigate();
    const [isInputValue, setInputValue] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImageFile, setIsImageFile] = useState<any | null>(null);
    const [isImageUrl, setIsImageUrl] = useState("");
    const [isLoading, setLoading] = useState(false);

    const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setIsImageUrl(imageUrl);
        }
    }

    const handleSubmitNewPost = (inputData: ThreadInput) => {
        setLoading(true)
        const token = Cookies.get("token");
        const data = {
            content: inputData.content,
            authorId: userData?.id,
            image: isImageFile
        };
        if (token) {
            createNewThread(token, data)
                .then(res => {
                    console.log(res);
                    retrieveAllThreads(setThreads);
                    setLoading(false)
                    navigate(-1);
                })
                .catch(error => console.log(error))
        }
    }

    return (
        <Box overflowX="hidden">
            <MainLayout titlePage=' ' isBackBtn={() => navigate(-1)}>
                <Box w="100%" h="fit-content">

                    {userData && (
                        <Box p={{ md: 0 }} position={{ base: "relative", md: "fixed" }} zIndex="15" top={0} bottom={0} left={0} right={0} display={{ md: "flex" }} alignItems={{ md: "center" }} justifyContent={{ md: "center" }} >
                            <Box onClick={() => navigate(-1)} position="absolute" top={0} left={0} cursor="pointer" w="100%" h="100%" bg={{ lg: "black" }} opacity="70%"></Box>

                            <Box w={{ base: "100%", md: "50%" }} p={{ base: 5, md: 10 }} bg={{ md: "theme.800" }} borderRadius={20} position="relative" overflow="hidden">

                                {isLoading && (
                                    <HStack justifyContent="center" position="absolute" zIndex={15} w="100%" h="100%" top="0" left="0" className='bg-black/50'>
                                        <Spinner size="xl" borderWidth="4px" color='white' />
                                    </HStack>
                                )}

                                <form onSubmit={handleSubmit(handleSubmitNewPost)} className='w-full'>
                                    <HStack alignItems="start" mb={4} pb={2} borderBottomWidth={1} borderColor="#3f3f3f">
                                        <Box w="40px" aspectRatio="1/1" borderRadius={100} bg="purple.500"></Box>
                                        <Box flex="1" h="fit-content">

                                            <Textarea
                                                {...register("content")}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                w="100%"
                                                px={2}
                                                placeholder='What is happening?!'
                                                fontSize="xl"
                                                outline="none"
                                                border="none"
                                                _placeholder={{ color: "theme.400" }}
                                                rows={5}
                                                minLength={1}
                                                mb={0}
                                            />
                                            <HStack gap={2}>
                                                <Box flex={1} h="fit-content" bg="theme.600" overflow="hidden">
                                                    <Box w={`${(isInputValue.length / 280) * 100}%`} h="1px" bg={isInputValue.length <= 200 ? "brand.500" : isInputValue.length <= 280 ? "orange.500" : "red.600"} overflow="hidden">
                                                    </Box>
                                                </Box>
                                                <Text w="10%" color={isInputValue.length <= 200 ? "brand.500" : isInputValue.length <= 280 ? "orange.500" : "red.600"} fontWeight="medium">
                                                    {isInputValue.length < 240 ? `${Math.floor((isInputValue.length / 280) * 100)}%` : 280 - isInputValue.length}
                                                </Text>
                                            </HStack>
                                            {isImageUrl && (
                                                <Box w="100%" h="fit-content" bg="theme.600" position="relative">
                                                    <Box onClick={() => { setIsImageFile(null); setIsImageUrl("") }} role="button" position="absolute" w="fit-content" aspectRatio="1/1" p={1} top="1" right="1" cursor="pointer" bg="red.600"
                                                        borderRadius={100} _hover={{ bg: "black" }}>
                                                        <X size="20px" />
                                                    </Box>
                                                    <Img src={isImageUrl} w="100%" maxH="800px" objectFit="cover"></Img>
                                                </Box>
                                            )}

                                        </Box>
                                    </HStack>
                                    <HStack justifyContent="flex-end">
                                        <Input onChange={handleImageFile} ref={fileInputRef} type='file' display="none"></Input>
                                        <Button onClick={() => fileInputRef.current!.click()} type="button" p={2} mx={0.5} borderRadius={100} bg="inherit" _hover={{ bg: "#353535" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                                            <Img src={addImage} w="100%"></Img>
                                        </Button>
                                        <Button
                                            isDisabled={isInputValue.length <= 0 || isInputValue.length > 280}
                                            opacity={isInputValue.length <= 0 || isInputValue.length > 280 ? "50%" : "100%"}
                                            type="submit"
                                            borderRadius={100}
                                            bg="#04A51E"
                                            color={"inherit"}
                                            size="md"
                                            _hover={{ bg: "#027815" }}
                                            _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                                            Post
                                        </Button>
                                    </HStack>
                                </form>
                            </Box>
                        </Box>
                    )}

                </Box>
            </MainLayout >
        </Box >
    )
}

export default CreateNewThreadPage