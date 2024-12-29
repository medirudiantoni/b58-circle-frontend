import MainLayout from "@/layouts";
import { Box, Button, HStack, Img, Input } from "@chakra-ui/react";
import addImage from "@/assets/add-image.svg";
import ThreadCard from "@/components/Thread/threadCard";
import useUserStore from "@/hooks/userStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { createNewThread } from "@/features/threads/services/thread.services";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCurrentUser } from "@/features/auth/services/auth-service";
import { UserDataType } from "@/types/user.types";
import useThreadStore from "@/hooks/threadStore";
import retrieveAllThreads from "@/features/threads/functions/thread.fetch";
import { UserRound } from "lucide-react";

const threadSchema = z.object({
  content: z.string().min(2, "post min 2 characters"),
});

type ThreadInput = z.infer<typeof threadSchema>

const Home = () => {
  const { register, handleSubmit } = useForm<ThreadInput>({
    resolver: zodResolver(threadSchema)
  });

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserDataType | null>(null);
  const [isValue, setIsValue] = useState("");

  const { userData } = useUserStore();
  const { threads, setThreads } = useThreadStore();

  useEffect(() => {
    retrieveAllThreads(setThreads);
    retrieveCurrentUser();
  }, []);

  async function retrieveCurrentUser() {
    const token = Cookies.get('token');
    try {
      if (token) {
        const currentUser = await getCurrentUser(token);
        setCurrentUser(currentUser.data);
      } else {
        throw new Error('Invalid token')
      };
    } catch (error) {
      console.log(error)
    }
  };

  const handleSubmitNewPost = (inputData: ThreadInput) => {
    const token = Cookies.get("token");
    const data = {
      content: inputData.content,
      authorId: currentUser?.id
    };
    if (token) {
      createNewThread(token, data)
        .then(res => {
          console.log(res)
          retrieveAllThreads(setThreads);
        })
        .catch(error => console.log(error))
    }
  }

  return (
    <Box overflowX="hidden">
      <MainLayout titlePage="Home">
        <Box w="100%" h="fit-content">

          {userData && (
            <Box display={{ base: "none", sm: "flex" }} p={5} borderBottomWidth={1} borderColor="#3f3f3f">
              <form onSubmit={handleSubmit(handleSubmitNewPost)}>
                <HStack onClick={() => navigate('/create')}>

                  {/* profile current User start */}
                  <HStack justifyContent="center" w="40px" aspectRatio="1/1" borderRadius={100} bg="theme.500" overflow="hidden">
                    {userData.profile ? (
                      <Img src={userData.profile} w="100%" h="100%" objectFit="cover" />
                    ) : (
                      <UserRound />
                    )}
                  </HStack>
                  {/* profile current User end */}

                  <Box flex="1" h="100%">
                    <Input
                      {...register("content")}
                      onChange={(e) => setIsValue(e.target.value)}
                      w="100%" px={2} placeholder="What is happening?!" fontSize="xl" outline="none" border="none" _placeholder={{ color: "#848484" }} _focus={{ outline: "none", border: "none", ring: "none" }}></Input>

                  </Box>
                  <Button type="button" p={2} mx={0.5} borderRadius={100} bg="inherit" _hover={{ bg: "#353535" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                    <Img src={addImage} w="100%"></Img>
                  </Button>
                  <Button type="submit" borderRadius={100} bg="#04A51E" color={"inherit"} size="md" mr={10} opacity={isValue.length > 0 ? "100%" : "50%"} _hover={{ bg: "#027815" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">Post</Button>
                </HStack>
              </form>
            </Box>
          )}

          {threads && threads.length > 0 && threads.map(thread => (
            <ThreadCard
              key={thread.id}
              url={`/status/${thread.id}`}
              content={thread.content}
              likes={thread.Like.length}
              replies={thread.Reply.length}
              image={thread.image}
              fullname={thread.User.username}
              username={thread.User.username}
              threadUserId={thread.User.id}
              createdAt={thread.createdAt}
              profile={thread.User.profile}
              isLiked={userData && thread.Like.find(like => like.userId === Number(userData!.id)) ? true : false}
              currentUserId={Number(userData?.id)}
              threadId={thread.id}
              onReply={() => navigate(`/status/${thread.id}/reply`)}
            />
          ))}

        </Box>
      </MainLayout >
    </Box >
  )
};

export default Home;