import { ObjectId } from "mongoose";

export interface IPost {
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  canBeLiked?: boolean;
  allowsComments?: boolean;
  tags?: string[];
}

export interface IGetPost {
  postId: ObjectId;
}
