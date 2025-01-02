import { LikeType } from "./like.types";
import { ThreadDataType } from "./thread.types";

export type UserType = {
  username: string;
  email: string;
};

export type Follower = {
  following?: UserDataType;
  follower?: UserDataType;
}

export type UserDataType = {
  id: string,
  email: string,
  username: string,
  fullname: string,
  password: string,
  profile?: string,
  background?: string,
  bio? : string,
  following: [],
  follower: Follower[],
  Like: LikeType[],
  Thread: ThreadDataType[],
}