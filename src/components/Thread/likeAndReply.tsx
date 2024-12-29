import { Box, HStack, Img, Text } from '@chakra-ui/react'
import likeBorder from "@/assets/likeborder.svg";
import like from "@/assets/like.svg";
import comment from "@/assets/comment.svg";
import React from 'react'

interface LikeAndReplyProps {
    likeFunction: (e: any) => void;
    isLike: boolean;
    likeLength: string;
    replyLength: string;
    onReply?: (e: any) => void;
}

const LikeAndReply: React.FC<LikeAndReplyProps> = ({likeFunction, isLike, likeLength, replyLength, onReply }) => {
    return (
        <HStack color="#848484" gap={6}>
            <HStack>
                <Box onClick={likeFunction} borderRadius={100} bg="inherit" cursor="pointer" _active={{ transform: "scale(0.9)" }} transitionDuration="75ms">
                    <Img src={isLike ? like : likeBorder} w="26px"></Img>
                </Box>
                <Text>{likeLength}</Text>
            </HStack>
            <HStack>
                <Box onClick={onReply} borderRadius={100} bg="inherit" cursor="pointer" _active={{ transform: "scale(0.9)" }} transitionDuration="75ms">
                    <Img src={comment} w="26px"></Img>
                </Box>
                <Text>{replyLength} Replies</Text>
            </HStack>
        </HStack>
    )
}

export default LikeAndReply;