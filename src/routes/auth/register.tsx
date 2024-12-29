import { fetchRegister } from '@/features/auth/services/auth-service';
import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Invalid username"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type RegisterFormInput = z.infer<typeof registerSchema>

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema)
  });

  const navigate = useNavigate();

  const onSubmit = (inputData: RegisterFormInput) => {
    console.log(inputData);
    fetchRegister(inputData)
      .then((res) => {
        if(res.data){
          console.log(res);
          navigate('/login')
        }
      })
      .catch((err) => console.log(err))
  };

  return (
    <Box w="100%" h="100vh" py={'32'} px={5}>
      <Box maxW="md" h="50vh" mx="auto">
        <Heading size="3xl" color="brand.500" mb={2}>Circle</Heading>
        <Text mb={3} fontSize="2xl">Create account Circle</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack mb={3}>
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

export default Register