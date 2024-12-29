import { Box, Button, Heading, HStack, Img, Text, VStack } from "@chakra-ui/react";
import Cookies from "js-cookie";
import home from "@/assets/home.svg";
import search from "@/assets/search.svg";
import follow from "@/assets/heart.svg";
import profile from "@/assets/profile.svg";
import logout from "@/assets/logout.svg";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/hooks/userStore";
import { PanelRightOpen, PenLine } from "lucide-react";
import React from "react";

export const navMenus = [
    {
        icon: home,
        label: "Home",
        url: "/"
    },
    {
        icon: search,
        label: "Search",
        url: "/search"
    },
    {
        icon: follow,
        label: "Follow",
        url: "/following"
    },
    {
        icon: profile,
        label: "Profile",
        url: "/profile"
    },
];

interface LeftSideOfMainLayoutProps {
    handleLeftPanel: () => void,
    isLeftPanelMobileActive: boolean;
}

const LeftSideOfMainLayout: React.FC<LeftSideOfMainLayoutProps> = ({ handleLeftPanel, isLeftPanelMobileActive }) => {
    const navigate = useNavigate();
    const { clearUser, clearUserData } = useUserStore();

    const { userData } = useUserStore();

    const handleLogOut = () => {
        Cookies.remove('token');
        clearUser();
        clearUserData();
        navigate('/login');
    }

    return (
        <Box
            w={{ base: "100vw", sm: "80px", lg: "25%" }}
            bg="theme.800"
            h="100vh"
            position="fixed"
            zIndex={11}
            top={0}
            left={{ base: isLeftPanelMobileActive ? "0" : "-100%", sm: "0" }}
            padding={{ base: "20px", sm: "0", lg: "40px" }}
            fontFamily="Plus Jakarta Sans"
        >
            <VStack
                w="100%"
                h="100%"
                justifyContent="space-between"
                alignItems={{ base: "start", sm: "center", lg: "start" }}
            >
                <Box w={{ base: "100%", sm: "80%", lg: "100%" }} h="fit-content">
                    <HStack alignItems="center" justifyContent="space-between">
                        <Heading
                            paddingX={{ base: 3, sm: 1, lg: 3 }}
                            textAlign={{ base: "start", sm: "center", lg: "start" }}
                            fontSize={{ base: "38px", sm: "20px", lg: "38px" }}
                            fontWeight="bold"
                            color="brand.500"
                            mb={{ base: 2, sm: 2 }}
                            mt={{ sm: "28px", lg: 0 }}
                        >
                            Circle
                        </Heading>
                        <Button
                            onClick={handleLeftPanel}
                            bg="inherit" display={{ base: "block", sm: "none" }} color="inherit" borderRadius={100} _hover={{ bg: "theme.500" }}>
                            <PanelRightOpen />
                        </Button>
                    </HStack>

                    <VStack w="100%" gap={0}>
                        {navMenus.map((item, id) => (
                            <Button
                                onClick={() => navigate(item.url)}
                                key={id}
                                w="100%"
                                display="flex"
                                gap={4}
                                paddingY="22px"
                                _hover={{ background: "#3f3f3f" }}
                                alignItems="center"
                                justifyContent={{ sm: "center", lg: "start" }}
                                fontSize={16}
                                bg="inherit"
                                color="white"
                                borderRadius={10}
                                fontWeight="normal"
                            >
                                <Img
                                    src={item.icon}
                                    w="28px"></Img>
                                <Text
                                    display={{ sm: "none", lg: "block" }}
                                >{item.label}</Text>
                            </Button>
                        ))}
                    </VStack>

                    {userData && (
                        <HStack w="100%" h="fit-content" justifyContent="center">
                            <Button
                                onClick={() => navigate('/create')}
                                mt={{ base: 6, sm: 2, lg: 6 }}
                                _hover={{ bg: "#16C833" }}
                                borderRadius={100}
                                bgColor="brand.500"
                                w={{ base: "100%", sm: "fit-content", lg: "100%" }}
                                fontSize={16}
                                color="white"
                                paddingY="20px">
                                <PenLine className="hidden sm:block lg:hidden" />
                                <Text display={{ base: "block", sm: "none", lg: "block" }}>Create Post</Text>
                            </Button>
                        </HStack>
                    )}
                </Box>

                <HStack w={{ base: "100%", sm: "fit-content", lg: "100%" }} h="10%" justifyContent={{ base: "center", lg: "start" }} alignItems="start">
                    {userData ? (
                        <Button
                            onClick={() => confirm("Are you sure?") && handleLogOut()}
                            display="flex"
                            alignItems="center"
                            gap={2}
                            borderRadius={10}
                            bg="inherit"
                            color="white"
                            _hover={{ bg: "#3f3f3f" }}>
                            <Img src={logout} w="28px"></Img>
                            <Text display={{ base: "block", sm: "none", md: "block" }}>Logout</Text>
                        </Button>
                    ) : (
                        <Button onClick={() => navigate('/login')} bg="brand.500" color="white" _hover={{ bg: "brand.600" }} _active={{ transform: "scale(0.95)", bg: "500.700" }}>Login</Button>
                    )}
                </HStack>

            </VStack>
        </Box>
    )
}

export default LeftSideOfMainLayout;