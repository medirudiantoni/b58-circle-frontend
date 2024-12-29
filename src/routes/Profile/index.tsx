import MainLayout from "@/layouts";
import { Box, HStack, Text } from "@chakra-ui/react";
import UserProfileCard from "@/components/layouts/UserProfileCard";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useUserStore from "@/hooks/userStore";
import { ThreadDataType } from "@/types/thread.types";
import { getThreadByUserId } from "@/features/threads/services/thread.services";
import ThreadCard from "@/components/Thread/threadCard";
import EditProfileModal from "@/components/userProfile/editProfile";
import UnauthorizedPage from "@/components/layouts/unauthorized";

const UserProfilePage = () => {
  const { userData } = useUserStore();
  const [threads, setThreads] = useState<ThreadDataType[] | null>(null);
  const [isEditProfile, setEditProfile] = useState(false);
  const [isUnauth, setIsUnauth] = useState(false);
  const [isMediaTab, setIsMediaTab] = useState(false);
  const [isThreadWithMedia, setIsThreadWithMedia] = useState<ThreadDataType[]>([]);

  useEffect(() => {
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

  useEffect(() => {
    if(threads) setIsThreadWithMedia(threads?.filter(th => th.image));
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
                  following={userData?.following.length}
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
              <div role="button" className="w-full h-fit grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {isThreadWithMedia?.map((thread, index) => {
                  return thread.image && (
                    <div key={thread.id} className={`${index == 4 ? "col-span-2 aspect-[4/2]" : "col-span-1 aspect-square"} overflow-hidden rounded-sm`}>
                      <img src={thread.image} className="w-full h-full object-cover"></img>
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