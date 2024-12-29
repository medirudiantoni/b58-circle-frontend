import { HStack, Text } from '@chakra-ui/react'

const NotFound = () => {
  return (
    <HStack w="100%" h="100vh" alignItems="center" justifyContent="center">
        <HStack gap={2}>
            <Text>404</Text>
            <Text>|</Text>
            <Text>Not Found</Text>
        </HStack>
    </HStack>
  )
}

export default NotFound