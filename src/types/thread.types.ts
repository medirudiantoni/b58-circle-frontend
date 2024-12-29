import { LikeType } from "./like.types";
import { UserDataType } from "./user.types";

export type ThreadsType = {
  authorId: number;
  content: string;
  createdAt: Date;
  id: number;
  image: string;
  updatedAt: Date;
};

export type ReplyType = {
  id: number,
  content: string,
  authorId: string,
  threadId: string,
  createdAt: Date,
  updatedAt: Date,
  image?: string,
  Like: LikeType[],
  Children: ReplyType[],
  User: UserDataType,
}

export type ThreadDataType = {
  id: number,
  content: string,
  authorId: string,
  createdAt: Date,
  updatedAt: Date,
  image?: string,
  Like: LikeType[],
  Reply: ReplyType[],
  User: UserDataType,
}