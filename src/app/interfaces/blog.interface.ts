export interface Blog {
  _id: string;
  userEmail: string;
  title: string;
  category: string;
  content: string;
  imageFile: string;
  views: number;
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  userEmail: string;
  comment: string;
}
