import MainLayout from "@/layouts";
import { Box, HStack, Text } from "@chakra-ui/react";
import UserProfileCard from "@/components/layouts/UserProfileCard";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ThreadDataType } from "@/types/thread.types";
import ThreadCard from "@/components/Thread/threadCard";
import { useParams } from "react-router-dom";
import { UserDataType } from "@/types/user.types";
import { fetchUserById } from "@/features/relation/services/users.service";
import useUserStore from "@/hooks/userStore";

const UsersProfilePage = () => {
  const { userId } = useParams();
  const { userData } = useUserStore();
  const [threads, setThreads] = useState<ThreadDataType[] | null>(null);
  const [userProfile, setUserProfile] = useState<UserDataType | null>(null);
  const [isMediaTab, setIsMediaTab] = useState(false);
  const [isThreadWithMedia, setIsThreadWithMedia] = useState<ThreadDataType[]>([]);

  useEffect(() => {
    retrieveTheUsersThreads();
  }, [userId]);

  async function retrieveTheUsersThreads() {
    const token = Cookies.get('token');
    try {
      if (token) {
        const theUser: UserDataType = await fetchUserById(token, userId!).then(res => res.data);
        setUserProfile(theUser);
        setThreads(theUser.Thread);
      } else {
        throw new Error('Invalid token')
      };
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (threads) setIsThreadWithMedia(threads?.filter(th => th.image));
  }, [threads]);
  return (
    <Box overflowX="hidden">
      <MainLayout titlePage={userProfile?.username} isUserProfilePage={false}>
        <Box w="100%" h="fit-content">
          <Box p={5} pb={0} borderBottomWidth={1} borderColor="#3f3f3f">
            <UserProfileCard
              profile={userProfile?.profile}
              background={userProfile?.background}
              username={userProfile?.username as string}
              fullname={userProfile?.fullname ? userProfile.fullname as string : userProfile?.username as string}
              bio={userProfile?.bio}
              following={userProfile?.following.length}
              follower={userProfile?.follower.length} />

            {/* Content navigation start */}
            <HStack w="100%" gap={0} position="relative" mt={5}>
              <Box role="button" onClick={() => setIsMediaTab(false)} p={2} flex={1} borderTopRadius={10} textAlign="center" fontSize="md" _hover={{ bg: "theme.600" }}>All Post</Box>
              <Box role="button" onClick={() => setIsMediaTab(true)} p={2} flex={1} borderTopRadius={10} textAlign="center" fontSize="md" _hover={{ bg: "theme.600" }}>Media</Box>
              <Box w="50%" position="absolute" bottom={0} borderBottomWidth={3} borderBottomColor="brand.500" transitionDuration="100ms" left={0} style={isMediaTab ? { transform: "translateX(100%)" } : { transform: "translateX(0%)" }} ></Box>
            </HStack>
            {/* Content navigation end */}
          </Box>

          {!isMediaTab ? (

            <Box w="100%">
              {threads ? threads.map(thread => (
                <ThreadCard
                  threadUserId={thread.User.id}
                  createdAt={thread.createdAt}
                  key={thread.id}
                  url={`/status/${thread.id}`}
                  isLiked={thread.Like.find(like => like.userId === Number(userData?.id)) ? true : false}
                  content={thread.content}
                  fullname={thread.User.fullname ? thread.User.fullname : thread.User.username as string}
                  username={thread.User.username}
                  likes={thread.Like.length}
                  replies={thread.Reply.length}
                  profile={thread.User.profile}
                  image={thread.image}
                  currentUserId={Number(userData?.id)}
                  threadId={thread.id}
                  retrieveReplies={() => retrieveTheUsersThreads()}
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

export default UsersProfilePage;