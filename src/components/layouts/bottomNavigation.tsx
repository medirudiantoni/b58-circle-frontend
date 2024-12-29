import { Box, Button, HStack, Img } from '@chakra-ui/react'
import { navMenus } from '@/layouts/leftSide';
import { PencilLine, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box
            display={{ base: "block", sm: "none" }}
            position="fixed"
            zIndex={12}
            bottom="0"
            width="100%"
            height="fit-content"
            px={10}
            py={3}
            bg="theme.500"
        >
            {!location.pathname.includes('/create') ? (
                <Button onClick={() => navigate('/create')} position="absolute" right={5} top={-20} borderRadius={100} bg="brand.500" color="white" h="fit-content" aspectRatio="1/1" _active={{ transform: "scale(0.95)" }}>
                    <PencilLine />
                </Button>
            ) : (
                <Button onClick={() => navigate(-1)} position="absolute" right={5} top={-20} borderRadius={100} bg="orange.500" color="white" h="fit-content" aspectRatio="1/1" _active={{ transform: "scale(0.95)" }}>
                    <X />
                </Button>
            )}
            <HStack w="100%" justifyContent="space-between">
                {navMenus.map((menu, id) => (
                    <Button onClick={() => navigate(menu.url)} key={id} borderRadius={100} bg="inherit" color="inherit" _hover={{ bg: "theme.400" }} >
                        <Img src={menu.icon} w="28px" />
                    </Button>
                ))}
            </HStack>
        </Box>
    )
}

export default BottomNavigation