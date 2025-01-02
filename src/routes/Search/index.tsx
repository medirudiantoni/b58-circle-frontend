// import Suggestion from "@/components/layouts/suggestion";
import MainLayout from "@/layouts";
import { Box, Input } from "@chakra-ui/react";
// import { Box, Heading, HStack, Input, Text } from "@chakra-ui/react";
// import { useState } from "react";

const SearchPage = () => {
  // const [isResults, setIsResults] = useState(true);
  return (
    <Box overflowX="hidden">
      <MainLayout>
        <Box w="100%" minH="100vh">
          <Box p={5}>
            <Input placeholder="Search user or post" w="100%" borderRadius={100} bg="#3f3f3f" borderColor="#04A51E" outline="none" ring="none" _hover={{ ring: "none", outline: "none" }} ringColor="#04A51E"></Input>
          </Box>

          {/* {isResults ? (
            <Box p={5} pt={0}> */}
              {/* <Suggestion following={false} fullname="buyan" username="buyan" bio="alamak" />
              <Suggestion following={false} fullname="buyan" username="buyan" bio="macam mana ini" />
              <Suggestion following={false} fullname="buyan" username="buyan" bio="agak laen kau kutengok" />
              <Suggestion following={false} fullname="buyan" username="buyan" bio="sudah berani kau ya??!" /> */}
            {/* </Box>
          ) : (
            <HStack w="100%" h="90vh" alignItems="center" justifyContent="center">
              <Box textAlign="center" w="50%">
                <Heading size="md" fontWeight="semibold">Write and search something!</Heading>
                <Text color="#767676">Try searching for something else or check the spelling of what you typed</Text>
              </Box>
            </HStack>
          )} */}

        </Box>
      </MainLayout>
    </Box>
  )
};

export default SearchPage;