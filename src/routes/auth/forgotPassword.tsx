import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

type RegisterFormInput = z.infer<typeof forgotPasswordSchema>

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInput>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  // const { addUser } = user

  const onSubmit = (inputData: RegisterFormInput) => {
    console.log(inputData);
  };

  return (
    <Box w="100%" h="100vh" py={'32'} px={5}>
      <Box maxW="md" h="50vh" mx="auto">
        <Heading size="3xl" color="brand.500" mb={2}>Circle</Heading>
        <Text mb={3} fontSize="2xl">Forgot password</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack mb={3}>
            {errors.email && <Text color="red.500" alignSelf="start">{errors.email.message}</Text>}
            <Input
              {...register("email")}
              w="100%"
              borderWidth="1px"
              borderRadius={'md'}
              borderColor="theme.500"
              color="theme.200"
              type='email'
              placeholder='Email'></Input>
            <Button type='submit' w="100%" borderRadius={100} bg="brand.500" color="inherit">Create</Button>
          </VStack>
        </form>
        <HStack>
          <Text>Already have an account?</Text>
          <Text color="brand.500">
            <Link to="/login">Login</Link>
          </Text>
        </HStack>
      </Box>
    </Box>
  )
}

export default ForgotPassword;