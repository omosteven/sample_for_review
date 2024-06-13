// --- used in create and edit post ----
export interface ICreatePost {
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  canBeLiked?: boolean;
  allowsComments?: boolean;
  tags?: string[];
}

// --- used in edit post, delete post, fetch post by id, like/unlike post,
export interface IPostId {
  postId: string;
}

export interface ITagName {
  tagName: string;
}

// --- used in add comment, edit comment ---
export interface IComment {
  content: string;
}

// --- used in edit comment, delete comment ---
export interface ICommentId {
  commentId: string;
}
