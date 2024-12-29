import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Box, HStack, Img, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import LikeAndReply from './likeAndReply';
import { fetchCreateLike, fetchDeleteLike } from '@/features/threads/services/like.services';
import useThreadStore from '@/hooks/threadStore';
import retrieveAllThreads from '@/features/threads/functions/thread.fetch';
import { EllipsisVertical, PenLine, Trash, UserRound } from 'lucide-react';
import { deleteThreadById } from '@/features/threads/services/thread.services';
import useUserStore from '@/hooks/userStore';
import { formatDateSince } from '@/utils/format-date';

interface ThreadCardProps {
    url: string,
    isReplyContent?: boolean,
    fullname?: string,
    username?: string,
    threadUserId: string,
    profile?: string,
    createdAt: Date,
    content: string,
    image?: string,
    likes: number,
    replies?: number,
    currentUserId: number,
    threadId?: number,
    replyId?: number,
    isLiked?: boolean,
    toChildReply?: () => void;
    onReply?: () => void;
    retrieveReplies?: () => void;
};

const ThreadCard: React.FC<ThreadCardProps> = ({ isReplyContent = false, url, fullname, username, threadUserId, profile, createdAt, content, image, likes, replies, currentUserId, threadId, replyId, isLiked = false, onReply, toChildReply, retrieveReplies }) => {
    const { setThreads } = useThreadStore();
    const { userData } = useUserStore();
    const [isLike, setIsLike] = useState(isLiked);
    const [isOption, setIsOption] = useState(false);
    const [sincePosted, setSincePosted] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const postDate = new Date(createdAt);
        setSincePosted(formatDateSince(postDate))
    }, [])

    const likeAction = async () => {
        const token = Cookies.get("token");

        const data = isReplyContent ?
            { userId: currentUserId, replyId } :
            { userId: currentUserId, threadId }

        try {
            if (token) {
                const liking = await fetchCreateLike(token, data);
                if (liking) {
                    setIsLike(true)
                    retrieveAllThreads(setThreads);
                    retrieveReplies && retrieveReplies();
                }
            }
        } catch (error) {
            console.log(error, "maybe the token is expired hehe...")
        }
    };

    const unlikeAction = async () => {
        const token = Cookies.get("token");
        
        const data = isReplyContent ?
            { userId: currentUserId, replyId } :
            { userId: currentUserId, threadId }

        if (token) {
            await fetchDeleteLike(token, data)
                .then(() => setIsLike(false))
                .then(() => {
                    retrieveAllThreads(setThreads);
                    retrieveReplies && retrieveReplies();
                })
                .catch(error => console.log(error))
        }
    };

    const handleLikeButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!isLike) {
            likeAction();
        } else {
            unlikeAction();
        }
    };

    const handleDelteThread = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const token = Cookies.get("token");
        try {
            const res = await deleteThreadById(String(token), String(threadId));
            if (res) {
                console.log('success delete thread')
                retrieveAllThreads(setThreads);
                return;
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleReplyButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onReply && onReply();
    }

    const handleNavigate = () => {
        navigate(url)
        toChildReply && toChildReply();
    }

    const handleEditButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`/edit/${threadId}`)
    };

    const handleOptionButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsOption(!isOption);
    }

    const handleRedirectToTheUser = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`/profile/${threadUserId}`)
    }

    return (
        <HStack onClick={handleNavigate} cursor="pointer" alignItems="start" p={5} gap={4} borderBottomWidth={1} borderColor="#3f3f3f">
            <HStack justifyContent="center" role='button' onClick={(e: any) => handleRedirectToTheUser(e)} w="40px" aspectRatio="1/1" borderRadius={100} overflow="hidden" bg="theme.500">
                {profile ? (
                    <Img src={profile} w="100%" aspectRatio="1/1" objectFit="cover"></Img>
                ) : (
                    <UserRound />
                )}
            </HStack>
            <Box flex="1">
                <HStack gap={2} mb={2} justifyContent="space-between" alignItems="start">
                    <HStack gap={2}>
                        <HStack gap={1}>
                            <Text>{fullname}</Text>
                            <Text color="theme.400">@{username}</Text>
                        </HStack>
                        <Box w={1} h={1} borderRadius={10} bg="#848484" className='translate-y-0.5'></Box>
                        <Text style={{ color: "#848484" }}> {sincePosted}</Text>
                    </HStack>
                    {userData?.username === username && (
                        <Box role='button' onClick={(e: any) => handleOptionButton(e)} onBlur={(e: any) => handleOptionButton(e)} p={1} position="relative" borderRadius={100} bg="theme.700">
                            <EllipsisVertical />
                            {isOption && (
                                <VStack gap={2} position="absolute" top="120%" right={0} p={1} borderRadius={12} bg="theme.600">
                                    <HStack role='button' onClick={(e: any) => handleEditButton(e)} w="100%" borderRadius={8} py={2} px={4} bg="orange.600" _hover={{ bg: "orange.700" }} color="white">
                                        <PenLine />
                                        <Text>Edit</Text>
                                    </HStack>
                                    <HStack role='button' onClick={(e: any) => confirm("Are you sure?!") && handleDelteThread(e)} w="100%" borderRadius={8} py={2} px={4} bg="red.600" _hover={{ bg: "red.700" }} color="white">
                                        <Trash />
                                        <Text>Delete</Text>
                                    </HStack>
                                </VStack>
                            )}
                        </Box>
                    )}
                </HStack>
                <Text mb={4}>
                    {content}
                </Text>
                {image && (
                    <Img src={image} maxW="80%" mb={4}></Img>
                )}
                <LikeAndReply onReply={(e: any) => handleReplyButton(e)} likeFunction={(e: any) => handleLikeButton(e)} isLike={isLike} likeLength={String(likes)} replyLength={String(replies)} />
            </Box>
        </HStack>
    )
}

export default ThreadCard;