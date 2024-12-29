import MainLayout from "@/layouts";
import { Box, Button, HStack, Img, Input, Text } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import addImage from "@/assets/add-image.svg";
import UserProfile from "@/components/userProfile";
import LikeAndReply from "@/components/Thread/likeAndReply";
import { useEffect, useRef, useState } from "react";
import ThreadCard from "@/components/Thread/threadCard";
import { ReplyType } from "@/types/thread.types";
import useUserStore from "@/hooks/userStore";
import { fetchCreateLike, fetchDeleteLike } from "@/features/threads/services/like.services";
import { createNewReply, getReplyById } from "@/features/threads/services/reply.service";
import { UserRound, X } from "lucide-react";

const ReplyPage = () => {
    const { replyId } = useParams();
    const { userData } = useUserStore();
    const navigate = useNavigate();
    const [isLike, setIsLike] = useState(false);
    const [reply, setReply] = useState<ReplyType | null>(null);
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
            threadId: reply?.threadId,
            parentId: reply?.id,
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
                retrieveTheReply();
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
            replyId: reply?.id,
        }
        try {
            if (token) {
                const liking = await fetchCreateLike(token, data);
                if (liking) {
                    setIsLike(true)
                    retrieveTheReply();
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
            replyId: reply?.id,
        }
        if (token) {
            await fetchDeleteLike(token, data)
                .then(() => setIsLike(false))
                .then(() => retrieveTheReply())
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

    const handleSetLikeState = () => {
        if (userData && reply?.Like.find(like => like.userId === Number(userData!.id))) {
            setIsLike(true)
        };
    }

    useEffect(() => {
        retrieveTheReply();
        setIsLike(false);
    }, [replyId]);

    useEffect(() => {
        handleSetLikeState();
    }, [userData, reply]);

    async function retrieveTheReply() {
        const token = Cookies.get('token');
        try {
            if (token) {
                const reply = await getReplyById(token, String(replyId));
                console.log(reply)
                setReply(reply);
                setIsImageFile(null)
                setIsImageUrl("");
                setInputValue("")
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

    return (
        <Box overflowX="hidden">
            <MainLayout titlePage="Reply" isBackBtn={() => navigate(-1)}>
                <Box w="100%" h="fit-content">

                    <Box p={5} w="100%" borderBottomWidth={1} borderColor="#3f3f3f">
                        <UserProfile
                            userId={String(reply?.User.id)}
                            image={reply?.User.profile}
                            fullname={reply?.User.fullname ? reply?.User.fullname : String(reply?.User.username)}
                            username={String(reply?.User.username)}
                        />
                        <Text mt="10px" mb="12px">{reply?.content}</Text>

                        {reply?.image && (
                            <Img src={reply.image} maxW="80%" objectFit="cover" maxH="800px" mb={4}></Img>
                        )}

                        <HStack color="#767676" fontWeight="medium" fontSize="sm" mb="12px">
                            <Text>11:32PM</Text>
                            <Box w={1} h={1} bg="#767676" borderRadius={100}></Box>
                            <Text>Jul 26, 2023</Text>
                        </HStack>
                        <LikeAndReply onReply={handleFocusOnInput} likeFunction={handleLike} isLike={isLike} likeLength={`${reply?.Like.length}`} replyLength={`${reply?.Children.length}`} />
                    </Box>

                    <Box p={5} borderBottomWidth={1} borderColor="#3f3f3f">
                        <HStack>

                            <HStack justifyContent="center" w="40px" aspectRatio="1/1" borderRadius={100} overflow="hidden" bg="theme.500">
                                {userData?.profile ? (
                                    <Img src={userData?.profile} w="100%" h="100%" objectFit="cover"></Img>
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

                    {reply?.Children ? reply.Children.map(reply => (
                        <ThreadCard
                            isReplyContent={true}
                            createdAt={reply.createdAt}
                            key={reply.id}
                            content={reply.content}
                            image={reply.image}
                            currentUserId={Number(userData?.id)}
                            fullname={reply.User.fullname ?? reply.User.username}
                            username={reply.User.username}
                            threadUserId={reply.User.id}
                            likes={reply.Like.length}
                            url={`/reply/${reply.id}`}
                            replyId={reply.id}
                            profile={reply.User.profile}
                            replies={reply.Children.length}
                            isLiked={userData && reply.Like.find(like => like.userId === Number(userData!.id)) ? true : false}
                            onReply={() => navigate(`/status/reply${reply.id}/reply`)}
                            retrieveReplies={() => retrieveTheReply()}
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

export default ReplyPage;