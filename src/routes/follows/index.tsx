// import Suggestion from "@/components/layouts/suggestion";
import useUserStore from "@/hooks/userStore";
import MainLayout from "@/layouts";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const FollowsPage = () => {
  const [isFollowingTab, setIsFollowingTab] = useState(false);
  const { pathname } = useLocation();
  const { userData } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname === '/following') {
      setIsFollowingTab(true)
    } else if (pathname === '/followers') {
      setIsFollowingTab(false)
    };
  }, [pathname]);
  return (
    <Box overflowX="hidden">
      <MainLayout titlePage="Follows">
        <Box w="100%" pt={2} h="fit-content">
          <Box px={5} py={0} borderBottomWidth={1} borderColor="#3f3f3f">
            <HStack position="relative" gap={0}>
              <Box left="0" style={isFollowingTab ? { transform: "translateX(100%)" } : { transform: "translateX(0%)" }} position="absolute" zIndex={5} bottom={0} w="50%" borderBottomWidth={3.5} borderBottomColor="#04A51E" transitionDuration="100ms"></Box>
              <Button onClick={() => navigate('/followers')} bg="inherit" color="inherit" borderBottomRadius={0} py={2} flex="1" textAlign="center" position="relative" _hover={{ bg: "#323232" }}>
                <Text>Followers</Text>
              </Button>
              <Button onClick={() => navigate('/following')} bg="inherit" color="inherit" borderBottomRadius={0} py={2} flex="1" textAlign="center" position="relative" _hover={{ bg: "#323232" }}>
                <Text>Following</Text>
              </Button>
            </HStack>
          </Box>

          <Box py={0}>
            {userData ? (
              <Outlet />
            ) : (
              <HStack w="100%" h="90%" justifyContent="center" alignItems="center">
                <Button onClick={() => navigate('/login')} bg="brand.500" color="white" _hover={{ bg: "brand.600" }} _active={{ transform: "scale(0.95)", bg: "500.700" }}>Login</Button>
              </HStack>
            )}
          </Box>

        </Box>
      </MainLayout>
    </Box>
  )
};

export default FollowsPage;