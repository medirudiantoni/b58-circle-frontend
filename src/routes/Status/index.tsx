import MainLayout from "@/layouts";
import { Box, Button, HStack, Img, Input, Text } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import addImage from "@/assets/add-image.svg";
import UserProfile from "@/components/userProfile";
import LikeAndReply from "@/components/Thread/likeAndReply";
import { useEffect, useRef, useState } from "react";
import ThreadCard from "@/components/Thread/threadCard";
import { getThreadById } from "@/features/threads/services/thread.services";
import { ThreadDataType } from "@/types/thread.types";
import useUserStore from "@/hooks/userStore";
import { fetchCreateLike, fetchDeleteLike } from "@/features/threads/services/like.services";
import { createNewReply } from "@/features/threads/services/reply.service";
import { UserRound, X } from "lucide-react";
import UnauthorizedPage from "@/components/layouts/unauthorized";
import { monthsName } from "@/utils/format-date";

const StatusPage = () => {
    const { idThread } = useParams();
    const { userData } = useUserStore();
    const [postHour, setPostHour] = useState("");
    const [postDate, setPostDate] = useState("");
    const navigate = useNavigate();
    const [isLike, setIsLike] = useState(false);
    const [thread, setThread] = useState<ThreadDataType | null>(null);
    const inputElRef = useRef<HTMLInputElement>(null);
    const [isInputValue, setInputValue] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isImageFile, setIsImageFile] = useState<any | null>(null);
    const [isImageUrl, setIsImageUrl] = useState("");

    const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setIsImageUrl(imageUrl);
        }
    }

    const handleSubmitReply = () => {
        const token = Cookies.get("token");
        const data = {
            content: isInputValue,
            authorId: userData?.id,
            threadId: thread?.id,
            image: isImageFile
        };
        if (isInputValue.length === 0) {
            alert("input must have not be blank")
            return false;
        }
        createNewReply(token!, data)
            .then(res => {
                console.log(res)
                setInputValue("");
                retrieveTheThread();
                setIsImageFile(null);
                setIsImageUrl("")
            })
            .catch(error => {
                console.log(error)
            })
    };

    const handleFocusOnInput = () => {
        if (inputElRef.current) {
            inputElRef.current.focus()
        }
    };

    const likeAction = async () => {
        const token = Cookies.get("token");
        const data = {
            userId: userData?.id,
            threadId: thread?.id,
        }
        try {
            if (token) {
                const liking = await fetchCreateLike(token, data);
                if (liking) {
                    setIsLike(true)
                    retrieveTheThread();
                }
            }
        } catch (error) {
            console.log(error, "maybe the token is expired hehe...")
        }
    };

    const unlikeAction = async () => {
        const token = Cookies.get("token");
        const data = {
            userId: userData?.id,
            threadId: thread?.id,
        }
        if (token) {
            await fetchDeleteLike(token, data)
                .then(() => setIsLike(false))
                .then(() => retrieveTheThread())
                .catch(error => console.log(error))
        }
    };

    const handleLike = () => {
        if (!isLike) {
            likeAction()
        } else {
            unlikeAction();
        }
    };

    useEffect(() => {
        retrieveTheThread();
    }, []);

    useEffect(() => {
        if (thread) {
            const postTime = new Date(thread.createdAt);
            setPostHour(`${postTime.getHours()}:${postTime.getSeconds()}`);
            setPostDate(`${monthsName[postTime.getMonth()]} ${postTime.getDate()}, ${postTime.getFullYear()}`);
        }
    }, [thread])

    useEffect(() => {
        if (userData && thread?.Like.find(like => like.userId === Number(userData!.id))) {
            setIsLike(true)
        };
    }, [userData, thread])

    async function retrieveTheThread() {
        const token = Cookies.get('token');
        try {
            if (token) {
                const thread = await getThreadById(token, String(idThread));
                console.log(thread.Reply[0])
                setThread(thread);
            } else {
                throw new Error('Invalid token')
            };
        } catch (error) {
            console.log(error)
        }
    };

    const location = useLocation();
    useEffect(() => {
        if (location.pathname.includes('/reply')) {
            inputElRef.current?.focus()
        }
        window.scrollTo(0, 0)
    }, [location.state]);

    if (!userData || userData.username === undefined) {
        return <UnauthorizedPage />
    } else
        return (
            <Box overflowX="hidden">
                <MainLayout titlePage="Status" isBackBtn={() => navigate(-1)}>
                    <Box w="100%" h="fit-content">

                        <Box p={5} w="100%" borderBottomWidth={1} borderColor="#3f3f3f">
                            <UserProfile
                                userId={String(thread?.User.id)}
                                image={thread?.User.profile}
                                fullname={thread?.User.fullname ? thread?.User.fullname : String(thread?.User.username)}
                                username={String(thread?.User.username)}
                            />
                            <Text mt="10px" mb="12px">{thread?.content}</Text>

                            {thread?.image && (
                                <Img src={thread.image} maxW="80%" objectFit="cover" maxH="800px" mb={4}></Img>
                            )}

                            <HStack color="#767676" fontWeight="medium" fontSize="sm" mb="12px">
                                <Text>{postHour}</Text>
                                <Box w={1} h={1} bg="#767676" borderRadius={100}></Box>
                                <Text>{postDate}</Text>
                            </HStack>
                            <LikeAndReply onReply={handleFocusOnInput} likeFunction={handleLike} isLike={isLike} likeLength={`${thread?.Like.length}`} replyLength={`${thread?.Reply.length}`} />
                        </Box>

                        {userData && (
                            <Box p={5} borderBottomWidth={1} borderColor="#3f3f3f">
                                <HStack>

                                    <HStack justifyContent="center" w="40px" aspectRatio="1/1" borderRadius={100} overflow="hidden" bg="theme.500">
                                        {userData.profile ? (
                                            <Img src={userData.profile} w="100%" h="100%" objectFit="cover"></Img>
                                        ) : (
                                            <UserRound />
                                        )}
                                    </HStack>

                                    {/* Input reply start */}
                                    <Box flex="1" h="100%">
                                        <Input value={isInputValue} onChange={(e) => setInputValue(e.target.value)} ref={inputElRef} w="100%" px={2} placeholder="Type your reply" fontSize="xl" outline="none" border="none" _placeholder={{ color: "#848484" }} _focus={{ outline: "none", border: "none", ring: "none" }}></Input>
                                    </Box>
                                    {/* input reply end */}

                                    {/* +image button start */}
                                    <Button onClick={() => fileInputRef.current!.click()} p={2} mx={0.5} borderRadius={100} bg="inherit" _hover={{ bg: "#353535" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                                        <Img src={addImage} w="100%"></Img>
                                    </Button>
                                    {/* +image button end */}

                                    {/* reply button start */}
                                    <Button onClick={handleSubmitReply} isDisabled={isInputValue.length === 0} borderRadius={100} bg="#04A51E" color={"inherit"} size="md" mr={10} _disabled={{ opacity: "50%" }} _hover={{ bg: "#027815" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">Reply</Button>
                                    {/* reply button end */}

                                    <Input onChange={handleImageFile} ref={fileInputRef} type='file' display="none"></Input>
                                </HStack>
                                {isImageUrl && (
                                    <Box mt={4} w="60%" borderRadius={10} ml="12%" overflow="hidden" position="relative">
                                        <Img src={isImageUrl} w="100%" maxH="600px" objectFit="cover"></Img>
                                        <Box onClick={() => { setIsImageFile(null); setIsImageUrl("") }} role="button" position="absolute" w="fit-content" aspectRatio="1/1" p={1} top="1" right="1" cursor="pointer" bg="red.600"
                                            borderRadius={100} _hover={{ bg: "black" }}>
                                            <X size="20px" />
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {thread?.Reply ? thread.Reply.map(reply => (
                            <ThreadCard
                                isReplyContent={true}
                                key={reply.id}
                                content={reply.content}
                                image={reply.image}
                                currentUserId={Number(userData?.id)}
                                fullname={thread.User.fullname ?? thread.User.username}
                                username={thread.User.username}
                                threadUserId={thread.User.id}
                                likes={reply.Like.length}
                                url={`/reply/${reply.id}`}
                                replyId={reply.id}
                                profile={reply.User.profile}
                                createdAt={reply.createdAt}
                                replies={reply.Children.length}
                                isLiked={userData && reply.Like.find(like => like.userId === Number(userData!.id)) ? true : false}
                                onReply={() => navigate(`/status/reply${reply.id}/reply`)}
                                retrieveReplies={() => retrieveTheThread()}
                            />
                        )) : (
                            <HStack w="100%" h="fit-content" justifyContent="center" py={20}>
                                <Text color="theme.400">No reply yet</Text>
                            </HStack>
                        )}

                    </Box>
                </MainLayout>
            </Box>
        )
};

export default StatusPage;