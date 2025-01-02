import MainLayout from "@/layouts";
import { Box, Button, HStack, Img, Input, Text } from "@chakra-ui/react";
import UserProfileCard from "@/components/layouts/UserProfileCard";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useUserStore from "@/hooks/userStore";
import { ThreadDataType } from "@/types/thread.types";
import { getThreadByUserId } from "@/features/threads/services/thread.services";
import ThreadCard from "@/components/Thread/threadCard";
import EditProfileModal from "@/components/userProfile/editProfile";
import UnauthorizedPage from "@/components/layouts/unauthorized";
import { ChevronLeft, UserRound, X } from "lucide-react";
import UserProfile from "@/components/userProfile";
import LikeAndReply from "@/components/Thread/likeAndReply";
import { useNavigate } from "react-router-dom";

const UserProfilePage = () => {
  const { userData } = useUserStore();
  const [threads, setThreads] = useState<ThreadDataType[] | null>(null);
  const [isEditProfile, setEditProfile] = useState(false);
  const [isUnauth, setIsUnauth] = useState(false);
  const [isMediaTab, setIsMediaTab] = useState(false);
  const [isThreadWithMedia, setIsThreadWithMedia] = useState<ThreadDataType[]>([]);
  const [isViewImage, setIsViewImage] = useState<string | null>(null);
  const [isViewImageThread, setIsViewImageThread] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("cek: ", userData);
    
    console.log(typeof userData)

    setIsUnauth(userData ? false : true);
    retrieveUserThreads();
  }, [userData]);

  async function retrieveUserThreads() {
    const token = Cookies.get('token');
    try {
      if (token) {
        const userThreads = await getThreadByUserId(token, userData!.id);
        setThreads(userThreads);
      } else {
        throw new Error('Invalid token')
      };
    } catch (error) {
      console.log(error)
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsViewImage(null);
    setIsViewImageThread(false);
  }
  const handleToggleImageThread = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsViewImageThread(!isViewImageThread);
  };

  useEffect(() => {
    if (threads) setIsThreadWithMedia(threads?.filter(th => th.image));
  }, [threads]);

  if (isUnauth) {
    return <UnauthorizedPage />
  } else
    return (
      <Box overflowX="hidden">
        <MainLayout titlePage={userData?.username} isUserProfilePage={false}>
          <Box w="100%" h="fit-content">
            <Box p={5} pb={0} borderBottomWidth={1} borderColor="#3f3f3f">
              {userData ? (
                <UserProfileCard
                  profile={userData.profile}
                  background={userData.background}
                  username={userData?.username as string}
                  fullname={userData?.fullname ? userData.fullname : userData?.username as string}
                  bio={userData?.bio}
                  following={userData?.following ? userData.following.length : 0}
                  follower={userData?.follower.length}
                  onEditProfile={() => setEditProfile(true)} />
              ) : (
                <UserProfileCard username="none" fullname="none" bio="none" following={0} follower={0} />
              )}

              {/* Content navigation start */}
              <HStack w="100%" gap={0} position="relative" mt={5}>
                <Box role="button" onClick={() => setIsMediaTab(false)} p={2} flex={1} borderTopRadius={10} textAlign="center" fontSize="md" _hover={{ bg: "theme.600" }}>All Post</Box>
                <Box role="button" onClick={() => setIsMediaTab(true)} p={2} flex={1} borderTopRadius={10} textAlign="center" fontSize="md" _hover={{ bg: "theme.600" }}>Media</Box>
                <Box w="50%" position="absolute" bottom={0} borderBottomWidth={3} borderBottomColor="brand.500" transitionDuration="100ms" left={0} style={isMediaTab ? { transform: "translateX(100%)" } : { transform: "translateX(0%)" }} ></Box>
              </HStack>
              {/* Content navigation end */}

            </Box>
            {isEditProfile && (
              <EditProfileModal onClose={() => setEditProfile(false)} />
            )}

            {!isMediaTab ? (
              <Box w="100%">
                {threads ? threads.map(thread => (
                  <ThreadCard
                    createdAt={thread.createdAt}
                    key={thread.id}
                    isLiked={thread.Like.find(like => like.userId === Number(userData!.id)) ? true : false}
                    url={`/status/${thread.id}`}
                    content={thread.content}
                    fullname={userData?.fullname ? userData.fullname : userData?.username as string}
                    username={thread.User.username}
                    threadUserId={thread.User.id}
                    likes={thread.Like.length}
                    replies={thread.Reply.length}
                    profile={thread.User.profile}
                    image={thread.image}
                    currentUserId={parseInt(userData!.id)}
                    threadId={thread.id}
                    retrieveReplies={() => retrieveUserThreads()}
                  />
                )) : (
                  <HStack w="100%" aspectRatio="4/3" alignItems="center" justifyContent="center">
                    <Box textAlign="center">
                      <Text color="theme.400">There is no post</Text>
                    </Box>
                  </HStack>
                )}
              </Box>
            ) : (
              <Box w="100%" p={2}>
                {isThreadWithMedia.length > 0 ? (
                  <div className="w-full h-fit grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
                    {isThreadWithMedia?.map((thread, index) => {
                      return thread.image && (
                        <div role="button" onClick={() => setIsViewImage(String(thread.id))} key={thread.id} className={`${index == 4 ? "col-span-2 aspect-[4/2]" : "col-span-1 aspect-square"} transition-all duration-200 ease-in-out overflow-hidden rounded-sm`}>

                          <div className={`w-full h-full ${isViewImage == String(thread.id) ? "fixed z-20 top-0 left-0 flex gap-0 items-center justify-center duration-200 ease-in-out transition-all bg-theme-800" : ""}`}>

                            {isViewImage && (
                              <>
                                <div role="button" onClick={(e: any) => handleClose(e)} className="fixed z-20 left-10 top-10 w-fit p-2 aspect-square rounded-full bg-neutral-50 hover:bg-neutral-200 active:bg-neutral-400 text-neutral-900">
                                  <X />
                                </div>
                                <div role="button" onClick={(e: any) => handleToggleImageThread(e)} className="fixed z-20 right-10 top-10 w-fit p-2 aspect-square rounded-full border-2 border-neutral-50 hover:bg-neutral-500 active:bg-neutral-600 text-neutral-50">
                                  <ChevronLeft />
                                </div>
                              </>
                            )}

                            {/* <img src={thread.image} className={`object-cover ${isViewImage ? "w-fit h-fit max-w-[80%] max-h-full relative z-10 transition-all duration-200 ease-in-out " : "w-full h-full"}`}></img> */}

                            <div className={`${isViewImage ? "flex-1 h-fit px-5 relative z-10 flex items-center justify-center transition-all duration-200 ease-in-out" : "w-full h-full"}`}>
                              <img src={thread.image} className={`object-cover overflow-hidden ${isViewImage ? `object-contain w-fit h-fit max-h-full relative z-10 transition-all duration-200 ease-in-out ${isViewImageThread ? "max-w-full" : "max-w-[80%]"}` : "w-full h-full"}`}></img>
                            </div>

                            <div className={`h-full overflow-hidden bg-theme-800 border-l border-theme-500 transition-all duration-200 ease-in-out overflow-y-auto py-10 ${isViewImageThread ? "translate-x-0 w-2/6" : "translate-x-full w-0 "}`}>

                              {/* the thread about image start */}
                              <Box p={5} w="100%" borderBottomWidth={1} borderColor="#3f3f3f">
                                <UserProfile
                                  userId={String(thread?.User.id)}
                                  image={thread?.User.profile}
                                  fullname={thread?.User.fullname ? thread?.User.fullname : String(thread?.User.username)}
                                  username={String(thread?.User.username)}
                                />
                                <Text mt="10px" mb="12px">{thread?.content}</Text>

                                <HStack color="#767676" fontWeight="medium" fontSize="sm" mb="12px">
                                  <Text>{'postHour'}</Text>
                                  <Box w={1} h={1} bg="#767676" borderRadius={100}></Box>
                                  <Text>{'postDate'}</Text>
                                </HStack>
                                <LikeAndReply onReply={() => console.log('first')} likeFunction={() => console.log('first')} isLike={false} likeLength={`${thread?.Like.length}`} replyLength={`${thread?.Reply.length}`} />
                              </Box>
                              {/* the thread about image end */}

                              {/* input start */}
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
                                      <Input value={'isInputValue'} w="100%" px={2} placeholder="Type your reply" fontSize="xl" outline="none" border="none" _placeholder={{ color: "#848484" }} _focus={{ outline: "none", border: "none", ring: "none" }}></Input>
                                    </Box>
                                    {/* input reply end */}

                                    {/* +image button start */}
                                    <Button p={2} mx={0.5} borderRadius={100} bg="inherit" _hover={{ bg: "#353535" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                                      {/* <Img src={addImage} w="100%"></Img> */}+
                                    </Button>
                                    {/* +image button end */}

                                    {/* reply button start */}
                                    <Button borderRadius={100} bg="#04A51E" color={"inherit"} size="md" mr={10} _disabled={{ opacity: "50%" }} _hover={{ bg: "#027815" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">Reply</Button>
                                    {/* reply button end */}

                                    <Input type='file' display="none"></Input>
                                  </HStack>
                                  {/* {isImageUrl && (
                                    <Box mt={4} w="60%" borderRadius={10} ml="12%" overflow="hidden" position="relative">
                                      <Img src={isImageUrl} w="100%" maxH="600px" objectFit="cover"></Img>
                                      <Box onClick={() => { setIsImageFile(null); setIsImageUrl("") }} role="button" position="absolute" w="fit-content" aspectRatio="1/1" p={1} top="1" right="1" cursor="pointer" bg="red.600"
                                        borderRadius={100} _hover={{ bg: "black" }}>
                                        <X size="20px" />
                                      </Box>
                                    </Box>
                                  )} */}
                                </Box>
                              )}
                              {/* input end */}

                              {/* Thread reply start */}
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
                                  profile={'reply.User.profile'}
                                  createdAt={reply.createdAt}
                                  // replies={reply.Children.length}
                                  isLiked={userData && reply.Like.find(like => like.userId === Number(userData!.id)) ? true : false}
                                  onReply={() => navigate(`/status/reply${reply.id}/reply`)}
                                  // retrieveReplies={() => retrieveTheThread()}
                                />
                              )) : (
                                <HStack w="100%" h="fit-content" justifyContent="center" py={20}>
                                  <Text color="theme.400">No reply yet</Text>
                                </HStack>
                              )}
                              {/* Thread reply end */}

                            </div>

                          </div>

                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center">
                    <p className="text-neutral-600">No Media here</p>
                  </div>
                )}
              </Box>
            )}

          </Box>
        </MainLayout>
      </Box>
    )
};

export default UserProfilePage;