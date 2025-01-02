import { fetchLogin } from '@/features/auth/services/auth-service';
import useUserStore from '@/hooks/userStore';
import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";
import Cookies from "js-cookie";
import { useState } from 'react';

const loginSchema = z.object({
  username: z.string().min(3, "Invalid username"),
  password: z.string().min(3, "Invalid password")
});

type LoginFormInput = z.infer<typeof loginSchema>

const Login = () => {
  const [isError, setIsError] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema)
  });

  const navigate = useNavigate();

  const { setUser, setUserData } = useUserStore();

  const onSubmit = (inputData: LoginFormInput) => {
    fetchLogin(inputData)
      .then((res) => {
        console.log(res);
        if(res.token){
          setUser(res.user);
          setUserData(res.data);
          Cookies.set('token', res.token);
          setIsError(false);
          navigate('/')
        }
      })
      .catch((err) => {
        console.log(err)
        setIsError(true);
      })
  };

  return (
    <Box w="100%" h="100vh" py={'32'} px={5}>
      <Box maxW="md" h="50vh" mx="auto">
        <Heading size="3xl" color="brand.500" mb={2}>Circle</Heading>
        <Text mb={3} fontSize="2xl">Login to Circle</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack mb={3}>
            {isError && <Text color="red.500" alignSelf="start">Invalid username or password</Text>}
            {errors.username && <Text color="red.500" alignSelf="start">Invalid username</Text>}
            <Input
              {...register("username")}
              w="100%"
              borderWidth="1px"
              borderRadius={'md'}
              borderColor="theme.500"
              color="theme.200"
              type='text'
              placeholder='Username'></Input>
            {errors.password && <Text color="red.500" alignSelf="start">{errors.password.message}</Text>}
            <Input
              {...register("password")}
              w="100%"
              borderWidth="1px"
              borderRadius={'md'}
              borderColor="theme.500"
              color="theme.200"
              type='password'
              placeholder='Password'></Input>
            <Button type='submit' w="100%" borderRadius={100} bg="brand.500" color="inherit">Login</Button>
          </VStack>
        </form>
        <HStack>
          <Text>Don't have an account yet?</Text>
          <Text color="brand.500">
            <Link to="/register">Create account</Link>
          </Text>
        </HStack>
      </Box>
    </Box>
  )
}

export default Login