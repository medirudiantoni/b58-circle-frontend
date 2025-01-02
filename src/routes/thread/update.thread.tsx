import retrieveAllThreads from '@/features/threads/functions/thread.fetch';
import useThreadStore from '@/hooks/threadStore';
import useUserStore from '@/hooks/userStore'
import MainLayout from '@/layouts'
import { Box, Button, HStack, Img, Input, Spinner, Text, Textarea } from '@chakra-ui/react'
// import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
// import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
// import z from "zod";
import { getThreadById, updateThreadById } from '@/features/threads/services/thread.services';
import addImage from "@/assets/add-image.svg";
import { X } from 'lucide-react';
import { ThreadDataType } from '@/types/thread.types';

// const threadSchema = z.object({
//     content: z.string().min(2, "post min 2 characters").max(280, "max 280 characters"),
// });

// type ThreadInput = z.infer<typeof threadSchema>

const UpdateThreadPage = () => {
    const { threadId } = useParams();
    const { userData } = useUserStore();
    const { setThreads } = useThreadStore();
    const inputElRef = useRef<HTMLTextAreaElement>(null)
    // const { register, handleSubmit } = useForm<ThreadInput>({
    //     resolver: zodResolver(threadSchema)
    // });

    const navigate = useNavigate();
    const [isTheThread, setTheThread] = useState<ThreadDataType | null>(null);
    const [isInputValue, setInputValue] = useState<any>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImageFile, setIsImageFile] = useState<any | null>(null);
    const [isImageUrl, setIsImageUrl] = useState<any>("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        retreieveGetThreadById();
        if (inputElRef.current) {
            inputElRef.current.focus()
        };
    }, []);

    useEffect(() => {
        setIsImageUrl(isTheThread?.image);
        setInputValue(isTheThread?.content);
    }, [isTheThread]);

    async function retreieveGetThreadById() {
        const token = Cookies.get("token");
        if (token && threadId)
            await getThreadById(token, threadId)
                .then(res => setTheThread(res))
                .catch(error => console.log(error))
    };

    const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setIsImageUrl(imageUrl);
        }
    }

    // const handleSubmitUpdateThread = (inputData: ThreadInput) => {
    const handleSubmitUpdateThread = (e?: Event) => {
        e?.preventDefault();
        console.log('tes')
        setLoading(true)
        const token = Cookies.get("token");
        const data = {
            content: isInputValue,
            authorId: userData?.id,
            image: isImageFile
        };
        if (token && threadId) {
            updateThreadById(token, data, threadId)
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
                            <Box onClick={() => navigate(-1)} position="absolute" top={0} left={0} cursor="pointer" w="100%" h="100%" bg={{ base: "inherit", md: "black" }} opacity="70%"></Box>

                            <Box w={{ base: "100%", md: "50%" }} p={{ base: 5, md: 10 }} bg={{ md: "theme.800" }} borderRadius={20} position="relative" overflow="hidden">

                                {isLoading && (
                                    <HStack justifyContent="center" position="absolute" zIndex={15} w="100%" h="100%" top="0" left="0" className='bg-black/50'>
                                        <Spinner size="xl" borderWidth="4px" color='white' />
                                    </HStack>
                                )}

                                <form
                                    onSubmit={(e: any) => handleSubmitUpdateThread(e)} className='w-full'>
                                    <HStack alignItems="start" mb={4} pb={2} borderBottomWidth={1} borderColor="#3f3f3f">
                                        <Box w="40px" aspectRatio="1/1" borderRadius={100} bg="purple.500"></Box>
                                        <Box flex="1" h="fit-content">

                                            <Textarea
                                                // {...register("content")}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                value={isInputValue}
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
                                                ref={inputElRef}
                                            />
                                            <HStack gap={2}>
                                                <Box flex={1} h="fit-content" bg="theme.600" overflow="hidden">
                                                    <Box w={`${(String(isInputValue).length / 280) * 100}%`} h="1px" bg={String(isInputValue).length <= 200 ? "brand.500" : String(isInputValue).length <= 280 ? "orange.500" : "red.600"} overflow="hidden">
                                                    </Box>
                                                </Box>
                                                <Text w="10%" color={String(isInputValue).length <= 200 ? "brand.500" : String(isInputValue).length <= 280 ? "orange.500" : "red.600"} fontWeight="medium">
                                                    {String(isInputValue).length < 240 ? `${Math.floor((String(isInputValue).length / 280) * 100)}%` : 280 - String(isInputValue).length}
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
                                            isDisabled={String(isInputValue).length <= 0 || String(isInputValue).length > 280}
                                            opacity={String(isInputValue).length <= 0 || String(isInputValue).length > 280 ? "50%" : "100%"}
                                            type="submit"
                                            borderRadius={100}
                                            bg="#04A51E"
                                            color={"inherit"}
                                            size="md"
                                            _hover={{ bg: "#027815" }}
                                            _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                                            Update
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

export default UpdateThreadPage;