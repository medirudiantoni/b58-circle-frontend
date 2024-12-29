import MainLayout from '@/layouts'
import { Box, Text, VStack } from '@chakra-ui/react'
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
    const navigate = useNavigate();
    return (
        <Box overflowX="hidden">
            <MainLayout>
                <Box w="100%" h="fit-content">

                    <Box p={{ md: 0 }} position={{ base: "relative", md: "fixed" }} zIndex="15" top={0} bottom={0} left={0} right={0} display={{ md: "flex" }} alignItems={{ md: "center" }} justifyContent={{ md: "center" }} >

                        <Box onClick={() => navigate(-1)} position="absolute" top={0} left={0} w="100%" h="100%" bg={{ lg: "black" }} opacity="70%"></Box>

                        <VStack alignItems="center" w={{ base: "100%", md: "50%" }} p={{ base: 5, md: 5 }} bg={{ md: "theme.800" }} borderRadius={20} position="relative" overflow="hidden">
                            <AlertCircle color='red'/>
                            <Text textAlign="center" fontSize="xl" fontWeight="medium" mb={2}>Unauthorized user!</Text>
                            <Text textAlign="center" size="sm" color="theme.300">You are not allowed to access this page due to expired session or you are not logged in.</Text>
                            <Text textAlign="center" mb={5}>Please login first or register new account!</Text>
                            <Box role='button' onClick={() => navigate('/login')} w="100%" py={2} px={4} borderRadius={10} bg="blue.600" color="white" textAlign="center" _hover={{ bg: "blue.700" }} _active={{ bg: "blue.900", transform: "scale(0.95)" }}>Login</Box>
                        </VStack>
                    </Box>


                </Box>
            </MainLayout >
        </Box >
    )
}

export default UnauthorizedPage;