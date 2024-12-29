import { Box, Button, HStack, Img, Input } from '@chakra-ui/react';
import addImage from "@/assets/add-image.svg";

const HeadingHome = () => {
    return (
        <Box p={5} borderBottomWidth={1} borderColor="#3f3f3f">
            <HStack>
                <Box w="40px" aspectRatio="1/1" borderRadius={100} bg="purple.500"></Box>
                <Box flex="1" h="100%">
                    <Input w="100%" px={2} placeholder="What is happening?!" fontSize="xl" outline="none" border="none" _placeholder={{ color: "#848484" }} _focus={{ outline: "none", border: "none", ring: "none" }}></Input>
                </Box>
                <Button p={2} mx={0.5} borderRadius={100} bg="inherit" _hover={{ bg: "#353535" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">
                    <Img src={addImage} w="100%"></Img>
                </Button>
                <Button borderRadius={100} bg="#04A51E" color={"inherit"} size="md" mr={10} opacity="50%" _hover={{ bg: "#027815" }} _active={{ transform: "scale(0.95)" }} transitionDuration="75ms">Post</Button>
            </HStack>
        </Box>
    )
}

export default HeadingHome