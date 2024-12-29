import { Button as ChakraButton } from '@chakra-ui/react';

type ButtonProps = {
  label: string;
  onClick: () => void;
};

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <ChakraButton onClick={onClick}>{label}</ChakraButton>
);
