import { Box, Button, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from "zod";

const resetPasswordSchema = z.object({
  newpassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type ResetPassFormInput = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPassFormInput>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const navigate = useNavigate();

  // const { addUser } = user

  const onSubmit = (inputData: ResetPassFormInput) => {
    console.log(inputData);
  };

  return (
    <Box w="100%" h="100vh" py={'32'} px={5}>
      <Box maxW="md" h="50vh" mx="auto">
        <Heading size="3xl" color="brand.500" mb={2}>Circle</Heading>
        <Text mb={3} fontSize="2xl">Create account Circle</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack mb={3}>
            {errors.newpassword && <Text color="red.500" alignSelf="start">{errors.newpassword.message}</Text>}
            <Input
              {...register("newpassword")}
              w="100%"
              borderWidth="1px"
              borderRadius={'md'}
              borderColor="theme.500"
              color="theme.200"
              type='password'
              placeholder='New Password'></Input>
            {errors.confirmPassword && <Text color="red.500" alignSelf="start">{errors.confirmPassword.message}</Text>}
            <Input
              {...register("confirmPassword")}
              w="100%"
              borderWidth="1px"
              borderRadius={'md'}
              borderColor="theme.500"
              color="theme.200"
              type='password'
              placeholder='Confirm Your Password'></Input>
            <Button type='submit' w="100%" borderRadius={100} bg="brand.500" color="inherit">Create</Button>
          </VStack>
        </form>
      </Box>
    </Box>
  )
}

export default ResetPassword