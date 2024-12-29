import { Box, Button, HStack } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import React from 'react'
import UserProfile from '../userProfile'
import { fetchFollowingAction, fetchUnfollowingAction } from '@/features/relation/services/follow.service'
import { getCurrentUser } from '@/features/auth/services/auth-service';
import useUserStore from '@/hooks/userStore';
import { useNavigate } from 'react-router-dom';

interface SuggestionProps {
    image?: string,
    fullname: string,
    username: string,
    idSubject: string,
    idObject: string,
    bio?: string,
    following: boolean,
    onClick?: () => void;
};

const Suggestion: React.FC<SuggestionProps> = ({ image, fullname, username, idSubject, idObject, following, bio, onClick }) => {
    const navigate = useNavigate();
    const { setUser, setUserData } = useUserStore();

    async function retrieveCurrentUser() {
        const token = Cookies.get('token');
        try {
            if (token) {
                const currentUser = await getCurrentUser(token);
                console.log(currentUser);
                setUserData(currentUser.data);
                setUser(currentUser.user);
            } else {
                throw new Error('Invalid token')
            };
        } catch (error) {
            console.log(error)
        }
    };
    const handleFollow = () => {
        const token = Cookies.get('token')!;
        const data = {
            followingId: String(idSubject),
        }
        fetchFollowingAction(token, data, String(idObject))
            .then(() => {
                retrieveCurrentUser();
            })
            .catch(error => console.log(error))
    }
    const handleUnfollow = () => {
        const token = Cookies.get('token')!;
        const data = {
            followingId: String(idSubject),
        }
        fetchUnfollowingAction(token, data, String(idObject))
            .then(() => {
                retrieveCurrentUser();
            })
            .catch(error => console.log(error))
    }
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        following ? confirm('Are you sure?') && handleUnfollow() : handleFollow();
        onClick && onClick();
    }
    return (
        <HStack onClick={() => navigate(`/profile/${idObject}`)} cursor="pointer" gap={3} alignItems={bio ? "start" : "center"} py={2} px={4} _hover={{ bg: "theme.600" }}>
            <UserProfile image={image} fullname={fullname} username={username} bio={bio} />
            <Box w="fit-content">
                <Button
                    onClick={handleClick}
                    borderRadius={100}
                    borderWidth={1}
                    bg="inherit"
                    color="inherit"
                    size="sm"
                    opacity={following ? "50%" : "100%"}
                >
                    {following ? 'following' : 'follow'}
                </Button>
            </Box>
        </HStack>
    )
}

export default Suggestion